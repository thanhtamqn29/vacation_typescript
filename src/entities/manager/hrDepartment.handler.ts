import { AfterCreate, AfterRead, BeforeCreate, BeforeRead, Handler, OnCreate, OnRead, OnReject, Req, Use } from "cds-routing-handlers";
import { HrManagerService, mng } from "../../entities";
import { HandleMiddleware } from "../../middlewares/handler.middleware";

@Handler(HrManagerService.SanitizedEntity.UserRequests)
@Use(HandleMiddleware)
export class HrManageDepartmentService {

    
    @AfterRead()
    public async HrDepartmentResponse(@Req() req: any) {
        return (req.results = req.results.filter( userRequest=> userRequest.request_status !== "removed"));
    }
}
