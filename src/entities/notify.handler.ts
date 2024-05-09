import { AfterRead, Handler, Req, Use } from "cds-routing-handlers";
import { epl } from "../entities";
import { flaggedNotification } from "../helpers/notification";
import { HandleMiddleware } from "../middlewares/handler.middleware";

@Handler(epl.EmployeeService.SanitizedEntity.EplNotifications)
@Use(HandleMiddleware)
export class NotificationsHandler {
    @AfterRead()
    public async beforeRead(@Req() req: any) {
        const { authentication, params } = req;

        if (params.length > 0) {
            await flaggedNotification(req.results, authentication);
        }
        if (params.length === 0) req.results = req.results.filter(notify => notify.receiver_ID === authentication.id);
    }
}
