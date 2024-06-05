import { AfterRead, BeforeRead, Handler, OnRead, Req, Use } from "cds-routing-handlers";
import { auth } from "../entities";
import { HandleMiddleware } from "../middlewares/handler.middleware";

@Handler(auth.AuthService.SanitizedEntity.Users)
@Use(HandleMiddleware)
export class AuthHandlers {
    @OnRead()
    public async returnNecessaryInfo(@Req() req: any) {
        const user = await cds.ql.SELECT.one
            .from("Users")
            .columns(col => {
                col.role;
                col.department_id;
            })
            .where({ ID: req.authentication.ID });

        const department = await cds.ql.SELECT.one
            .from("Departments")
            .columns(col => {
                col.isHRDepartment;
            })
            .where({ id: user.department_id });
        const results = {role: user.role, department_id: department.isHRDepartment };
        req.results = results;
    }
}
