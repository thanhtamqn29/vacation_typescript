import { AfterRead, Handler, Req, Use } from "cds-routing-handlers";
import { mng } from "../../entities";
import { HandleMiddleware } from "../../middlewares/handler.middleware";

@Handler(mng.ManagerService.SanitizedEntity.MngDepartments)
@Use(HandleMiddleware)
export class ManageDepartmentService {
    @AfterRead()
    public async departmentResponse(@Req() req: any) {
        return (req.results = req.results.filter(department => department.id === req.authentication.department));
    }
}
