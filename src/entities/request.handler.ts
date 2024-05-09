import { Handler, Req, BeforeCreate, OnRead, Use, AfterCreate, BeforeUpdate, AfterDelete, OnCreate, AfterUpdate, BeforeDelete } from "cds-routing-handlers";
import { epl } from "../entities";
import { HandleMiddleware } from "../middlewares/handler.middleware";
import { getAllDaysBetween } from "../helpers/leaveDayCalculation";
import { notify } from "../helpers/notification";
import cds from "@sap/cds";
@Handler(epl.EmployeeService.SanitizedEntity.EplRequests)
@Use(HandleMiddleware)
export class EmployeeServiceHandler {
    @BeforeCreate()
    @BeforeUpdate()
    public async validDateTime(@Req() req: any): Promise<any> {
        const { data } = req;
        const request = await cds.ql.SELECT.one.from("Requests").where({ ID: req.params[0] });
        if (!request) return req.error(500, "Couldn't find this request", "");
        if (data.shift && data.endDay) return req.error(400, "You take one shift leave, you shouldn't fill the end day");
        else {
            const startDay = new Date(data.startDay);
            const endDay = new Date(data.endDay);
            const currentDate = new Date();

            if (startDay < currentDate || endDay < currentDate) {
                return req.error(400, "Start day and end day must be after the current date.", "");
            } else if (startDay >= endDay) {
                return req.error(400, "End day must be after start day.", "");
            }
        }
    }

    @BeforeUpdate()
    public async validInput(@Req() req: any): Promise<any> {
        const { data } = req;
        if (data.status || data.comment) return req.error(400, "You cannot update these field!!", "");
    }

    @BeforeUpdate()
    @BeforeDelete()
    public async validRequest(@Req() req: any): Promise<any> {
        const [request] = await cds.ql.SELECT("Requests").where({ ID: req.params[0] });

        if (request.status !== "pending") return req.error(400, "This request has just adjusted by the manager, you cannot modify it!!!", "");
    }

    @OnRead()
    public async getOwnRequest(@Req() req: any): Promise<any> {
        const { authentication } = req;
        if (req.params.length > 0) {
            const request = await cds.read("Requests").where({ user_ID: authentication.id, ID: req.params[0] });
            req.results = request;
        }
        const requests = await cds.read("Requests").where({ user_ID: authentication.id });
        console.log(requests);

        req.results = requests;
    }

    @AfterCreate()
    public async updateRequest(@Req() req: any) {
        const { data, authentication } = req;

        const user = await cds.ql.SELECT.one.from("Users").where({ ID: authentication.id });

        const offDays = getAllDaysBetween(new Date(req.data.startDay), new Date(req.data.endDay));
        if (offDays.length > user.dayOffThisYear + user.dayOffLastYear) {
            await cds.ql
                .UPDATE("Requests")
                .where({ ID: req.data.ID })
                .set({ ...data, isOutOfDay: true, user_ID: user.ID });
        } else {
            await cds.ql
                .UPDATE("Requests")
                .where({ ID: req.data.ID })
                .set({ ...data, user_ID: user.ID });
        }
        const response = await cds.ql.SELECT.one.from("Requests").where({ ID: data.ID });

        await notify({ data: response, authentication }, "created");
        return req.reply({ code: 200, message: "Created successfully", data: req.reply });
    }

    @AfterDelete()
    public async deleteRequest(@Req() req: any) {
        const { data, authentication } = req;
        if (data || data?.length > 0) req.reply({ code: 200, message: "Canceled successfully" });
        await notify({ data: data, authentication }, "deleted");
    }

    @AfterUpdate()
    public async sendingNotify(@Req() req: any) {
        const { data, authentication } = req;
        await notify({ data: data, authentication }, "updated");
    }
}
