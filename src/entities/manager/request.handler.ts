import { AfterRead, AfterUpdate, BeforeCreate, BeforeUpdate, Handler, OnCreate, OnReject, OnUpdate, Req, Use } from "cds-routing-handlers";
import { mng } from "../../entities";
import { HandleMiddleware } from "../../middlewares/handler.middleware";
import { notify } from "../../helpers/notification";

@Handler(mng.ManagerService.SanitizedEntity.MngRequests)
@Use(HandleMiddleware)
export class RequestManageService {
    @BeforeUpdate()
    public async validInput(@Req() req: any) {
        const request = await SELECT.one.from("Requests").where({ ID: req.params[0] });

        if (request === null) return req.error(500, "Couldn't find this request", "");

        if (request.status !== "pending") return req.error(400, `You have already ${request.status} this request!!`, "");

        req.dataTransaction = {
            id: request.user_ID,
        };
    }

    @OnUpdate()
    public async validManager(@Req() req: any) {
        const { dataTransaction, authentication } = req;
        const member = await SELECT.one.from("Users").where({ ID: dataTransaction.id });
        if (member.department_id !== authentication.department) req.error(400, "You're not the manager of this request!!!", "");
        await cds.ql.UPDATE("Requests").set(req.data).where({ ID: req.params[0] });
    }

    @AfterRead()
    public async updateRequest(@Req() req: any) {
        const { authentication } = req;
        const query = SELECT.from("Requests").columns(col => {
            col.ID, col.reason, col.startDay, col.endDay, col.status, col.isOutOfDay, col.dayOffType;
            col.shift;
            col.comment;
            col.user(user => {
                user.ID, user.department_id, user.fullName, user.username;
            });
        });
        if (req.params.length > 0) {
            query.where({ ID: req.params[0] });
        }
        const requests = await query;
        console.log(requests);

        const data = requests.filter(request => request.user?.department_id === authentication.department && request.status !== "removed");

        return req.reply(data);
    }

    @AfterUpdate()
    public async afterUpdate(@Req() req: any) {
        const { authentication } = req;
        const [data] = await cds.ql
            .SELECT("Requests")
            .columns(col => {
                col.ID,
                    col.status,
                    col.user_ID,
                    col.user(user => {
                        user.ID, user.fullName;
                    });
            })
            .where({ ID: req.params[0] });

        await notify({ data, authentication }, data.status);
        req.reply({
            message: `You have ${data.status} ${data.user.fullName} request!!`,
            data: data,
        });
    }
}
