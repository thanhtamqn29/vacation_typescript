import { AfterRead, Handler, Req, Use } from "cds-routing-handlers";

import { HandleMiddleware } from "../../middlewares/handler.middleware";
import { mng } from "../../entities";
@Handler(mng.ManagerService.SanitizedEntity.MngUsers)
@Use(HandleMiddleware)
export class ManageDepartmentService {
    @AfterRead()
    public async userManagerResponse(@Req() req: any) {
        return (req.results = req.results.filter(user => user.department_id === req.authentication.department));
    }
}
