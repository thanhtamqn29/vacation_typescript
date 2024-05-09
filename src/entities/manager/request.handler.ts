import { AfterRead, AfterUpdate, BeforeUpdate, Handler, OnUpdate, Req, Use } from "cds-routing-handlers";
import { mng } from "../../entities";
import { HandleMiddleware } from "../../middlewares/handler.middleware";
import { getAllDaysBetween, getDaysBeforeAfterApril, removeHolidays } from "../../helpers/leaveDayCalculation";
import { notify } from "../../helpers/notification";

@Handler(mng.ManagerService.SanitizedEntity.MngRequests)
@Use(HandleMiddleware)
export class RequestManageService {
    @AfterRead()
    public async updateRequest(@Req() req: any) {
        const { authentication } = req;
        const query = SELECT.from("Requests").columns(col => {
            col.ID,
                col.reason,
                col.startDay,
                col.endDay,
                col.status,
                col.isOutOfDay,
                col.user(user => {
                    user.ID, user.department_id, user.fullName, user.username;
                });
        });
        if (req.params.length > 0) {
            query.where({ ID: req.params[0] });
        }
        const requests = await query;

        console.log(requests);

        const data = requests.filter(request => request.user?.department_id === authentication.department);

        return req.reply(data);
    }

    @BeforeUpdate()
    public async validInput(@Req() req: any) {
        const request = await SELECT.one.from("Requests").where({ ID: req.params[0] });
        
        if (request === null)
            return req.error(500, "Couldn't find this request", "");
        
        if (request.status !== "pending") {
            return req.error(400, `You have already ${request.status} this request!!`, "");
        }
        req.dataTransaction = {
            id: request.user_ID,
        };
    }

    @OnUpdate()
    public async validManager(@Req() req: any) {
        console.log(req.error);
        
        const { dataTransaction, authentication } = req;
        const member = await SELECT.one.from("Users").where({ ID: dataTransaction.id });
        if (member.department_id !== authentication.department) req.error(400, "You're not the manager of this request!!!", "");
        await cds.ql.UPDATE("Requests").set(req.data).where({ ID: req.params[0] });
    }

    @AfterUpdate()
    public async removeTotalDayOff(@Req() req: any) {
        const { authentication } = req;
        const request = await SELECT.one.from("Requests").where({ ID: req.params[0] });
        const user = await cds.ql.SELECT.one.from("Users").where({ ID: req.dataTransaction.id });

        let endDay = new Date(request.endDay + "T23:59:59Z");
        let startDay = new Date(request.startDay + "T00:00:00Z");

        const removeWeekend = getAllDaysBetween(startDay, endDay);
        const removeHoliday = await removeHolidays(removeWeekend);

        startDay = new Date(request.startDay + "T00:00:00Z");
        endDay = new Date(request.endDay + "T23:59:59Z");

        const startDayMonth = startDay.getMonth();
        const endDayMonth = endDay.getMonth();

        if (startDayMonth >= 3) user.dayOffLastYear = 0;

        if (request.shift) {
            if (!user.dayOffLastYear) {
                await cds.ql
                    .UPDATE("Users")
                    .where({ ID: request.user_ID })
                    .set({
                        dayOffThisYear: { "-=": 0.5 },
                    });
            } else {
                if (startDayMonth < 3) {
                    await cds.ql
                        .UPDATE("Users")
                        .set({ dayOffLastYear: { "-=": 0.5 } })
                        .where({ ID: user.ID });
                }
                if (startDayMonth > 3) {
                    await cds.ql
                        .UPDATE("Users")
                        .set({ dayOffThisYear: { "-=": 0.5 } })
                        .where({ ID: user.ID });
                }
            }
        }
        if (request.endDay) {
            if (!user.dayOffLastYear) {
                await cds.ql
                    .UPDATE("Users")
                    .where({ ID: request.user_ID })
                    .set({
                        dayOffThisYear: { "-=": removeHoliday.length },
                    });
            } else {
                if (startDayMonth < 3 && endDayMonth == 3) {
                    const { daysBeforeApril, daysAfterApril } = getDaysBeforeAfterApril(removeHoliday);
                    const newDayOffLastYear = user.dayOffLastYear - daysBeforeApril;

                    await cds.ql
                        .UPDATE("Users")
                        .set({ dayOffThisYear: { "-=": daysAfterApril } })
                        .where({ ID: user.ID });

                    if (newDayOffLastYear >= 0) await cds.ql.UPDATE("Users").set({ dayOffLastYear: newDayOffLastYear }).where({ ID: user.ID });

                    if (newDayOffLastYear < 0)
                        await cds.ql
                            .UPDATE("Users")
                            .set({
                                dayOffLastYear: 0,
                                dayOffThisYear: { "+=": newDayOffLastYear },
                            })
                            .where({ ID: user.ID });
                } else {
                    const newDayOffLastYear = user.dayOffLastYear - removeHoliday.length;

                    if (newDayOffLastYear >= 0)
                        await cds.ql
                            .UPDATE("Users")
                            .set({ dayOffLastYear: { "-=": removeHoliday.length } })
                            .where({ ID: user.ID });

                    if (newDayOffLastYear < 0)
                        await cds.ql
                            .UPDATE("Users")
                            .set({
                                dayOffLastYear: 0,
                                dayOffThisYear: { "+=": newDayOffLastYear },
                            })
                            .where({ ID: user.ID });
                }
            }
        }

        const [data] = await cds.ql.SELECT("Requests").where({ ID: req.params[0] });
        console.log(data);

        await notify({ data, authentication }, data.status);
        return req.reply("Updated successfully");
    }
}