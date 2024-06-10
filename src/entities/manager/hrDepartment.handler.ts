import { AfterRead, Handler, Req, Use } from "cds-routing-handlers";
import { HrManagerService } from "../../entities";
import { HandleMiddleware } from "../../middlewares/handler.middleware";

@Handler(HrManagerService.SanitizedEntity.UserRequests)
@Use(HandleMiddleware)
export class HrManageDepartmentService {
    @AfterRead()
    public async HrDepartmentResponse(@Req() req: any) {
        return (req.results = req.results.filter(userRequest => userRequest.request_status !== "removed"));
    }
}
