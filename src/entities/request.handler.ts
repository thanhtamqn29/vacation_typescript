import { Handler, Req, BeforeCreate, OnRead, Use, AfterCreate, BeforeUpdate, AfterDelete } from "cds-routing-handlers";
import { RequestService } from "../entities";
import { Request } from "@sap/cds/apis/services";
import { DataCustom, RequestResponse } from "../types/types";
import { HandleMiddleware } from "../middlewares/middlewareChecker";
import { getAllDaysBetween } from "../helpers/getDays";

@Handler(RequestService.SanitizedEntity.Requests)
@Use(HandleMiddleware)
export class RequestServiceHandler {
    @BeforeCreate()
    @BeforeUpdate()
    public async createRequest(@Req() req: Request): Promise<any> {
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
    public async getOwnRequest(@Req() req: RequestResponse): Promise<any> {
        const { authentication } = req;

        if (req.params.length > 0) {
            const request = await cds.read("Requests").where({ user_ID: authentication.id, ID: req.params[0] });
            req.results = request;
        }

        const requests = await cds.read("Requests").where({ user_ID: authentication.id });

        req.results = requests;
    }

    @AfterCreate()
    public async updateRequest(@Req() req: DataCustom) {
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
    }

    @AfterDelete()
    public async deleteRequest(@Req() req: RequestResponse) {
        const { data } = req;
        if (data || data?.length > 0) req.results = { code: 200, message: "Canceled successfully" };
    }
}
