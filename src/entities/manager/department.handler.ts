import { AfterCreate, BeforeCreate, BeforeRead, Handler, OnCreate, Req, Use } from "cds-routing-handlers";
import { ManagerService } from "../../entities";
import { HandleMiddleware } from "../../middlewares/handler.middleware";
import { DataCustom } from "../../types/types";

@Handler(ManagerService.SanitizedEntity.Departments)
@Use(HandleMiddleware)
export class ManageService {
    @BeforeCreate()
    public async createID(@Req() req: DataCustom) {
        const departments = await cds.ql.SELECT("Departments");

        req.data = { id: departments.length + 1, ...req.data };
    }

    @AfterCreate()
    public async updateManager(@Req() req: DataCustom) {
        await cds.ql.UPDATE("Users").set({department_id : req.data.id}).where({ID: req.authentication.id})
    }
}
