import { Handler, Req, BeforeCreate, OnRead, Use, AfterCreate, BeforeUpdate, AfterDelete, OnCreate, AfterUpdate } from "cds-routing-handlers";
import { RequestService } from "../entities";
import { HandleMiddleware } from "../middlewares/handler.middleware";
import { getAllDaysBetween } from "../helpers/leaveDayCalculation";
import { notify } from "../helpers/notification";
import cds from "@sap/cds";
@Handler(RequestService.SanitizedEntity.Requests)
@Use(HandleMiddleware)
export class RequestServiceHandler {
    @BeforeCreate()
    @BeforeUpdate()
    public async validDateTime(@Req() req: any): Promise<any> {
        const startDay = new Date(req.data.startDay);
        const endDay = new Date(req.data.endDay);
        const currentDate = new Date();

        if (startDay < currentDate || endDay < currentDate) {
            return req.error(400, "Start day and end day must be after the current date.", "");
        } else if (startDay >= endDay) {
            return req.error(400, "End day must be after start day.", "");
        }
    }

    @OnRead()
    public async getOwnRequest(@Req() req: any): Promise<any> {
        const { authentication } = req;

        if (req.params.length > 0) {
            const request = await cds.read("Requests").where({ user_ID: authentication.id, ID: req.params[0] });
            req.reply = request;
        }

        const requests = await cds.read("Requests").where({ user_ID: authentication.id });

        req.reply = requests;
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

        await notify({ data: response, authentication }, "new");
        return req.reply({ code: 200, message: "Created successfully", data: req.reply });
    }

    @AfterDelete()
    public async deleteRequest(@Req() req: any) {
        const { data, authentication } = req;
        if (data || data?.length > 0) req.reply({ code: 200, message: "Canceled successfully" });
        await notify({ data: data, authentication }, "delete");
    }

    @AfterUpdate()
    public async sendingNotify(@Req() req: any) {
        const { data, authentication } = req;
        await notify({ data: data, authentication }, "update");
    }
}
