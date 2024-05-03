import { BeforeCreate, Handler, Req, Use } from "cds-routing-handlers";
import { ManagerService } from "../../entities";
import { HandleMiddleware } from "../../middlewares/handler.middleware";
import { DataCustom } from "../../types/types";

@Handler(ManagerService.SanitizedEntity.Calendar)
@Use(HandleMiddleware)
export class CalendarHandler {
    @BeforeCreate()
    public async validDateTime(@Req() req: DataCustom) {
        const { data } = req;
        const startDay = new Date(data.startDay + "T00:00:00Z");
        const endDay = new Date(data.endDay + "T23:59:59Z");

        if (startDay > endDay) return req.error(400, "Start day cannot greater than end day", "");
        if (endDay < startDay) return req.error(400, "End day cannot less than start day", "");
    
    }
}
