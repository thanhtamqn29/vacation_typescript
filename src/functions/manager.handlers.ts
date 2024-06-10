import { Action, Func, Handler, Param, Req, Use } from "cds-routing-handlers";
import { mng } from "../entities";
import { HandleMiddleware } from "../middlewares/handler.middleware";

@Handler()
@Use(HandleMiddleware)
export class ManagerHandle {
    @Action(mng.ManagerService.ActionCreateDepartment.name)
    public async createDepartment(@Param(mng.ManagerService.ActionCreateDepartment.paramDepartmentName) departmentName: string, @Req() req: any) {
        const user = await cds.ql.SELECT.one.from("Users").where({ ID: req.authentication.ID });

        if (user.department_id) return req.error(400, "You already have a department", "");

        const departments = await cds.ql.SELECT("Departments");

        req.data = { id: departments.length + 1, ...req.data };

        await cds.ql.INSERT.into("Departments").entries(req.data);

        await cds.ql.UPDATE("Users").set({ department_id: req.data.id }).where({ ID: req.authentication.ID });

        const data = await cds.ql.SELECT("Departments").where({ ID: req.data.id });
        return (req.results = {
            code: 201,
            message: "Created department successfully",
            data: data,
        });
    }

    @Action(mng.ManagerService.ActionInvite.name)
    public async invite(@Req() req: any, @Param(mng.ManagerService.ActionInvite.paramIds) ids: string[]) {
        const user = await SELECT.one.from("Users").where({ ID: req.authentication.ID });

        const getDepartment = await SELECT.one.from("Departments").where({ id: user.department_id, isActive: true });
        if (!getDepartment) return req.reject(404, "Couldn't find this department");

        let newMembers = [];
        let alreadyInDepartment = [];
        let notInSystem = [];

        for (const member of ids) {
            const user = await SELECT.one.from("Users").where({ ID: member });
            if (user) {
                if (!user.department_id) {
                    await cds.ql.UPDATE("Users").where({ ID: user.ID }).set({ department_id: getDepartment.id });
                    newMembers.push(member);
                } else {
                    alreadyInDepartment.push(member);
                }
            } else {
                notInSystem.push(member);
            }
        }
        let responseMessage = "";

        if (newMembers.length > 0) {
            responseMessage += `New members in the department: ${newMembers.join(", ")}. `;
        }

        if (alreadyInDepartment.length > 0) {
            responseMessage += `Already in a department: ${alreadyInDepartment.join(", ")}. `;
        }

        if (notInSystem.length > 0) {
            responseMessage += `Not in the system: ${notInSystem.join(", ")}. `;
        }

        return req.reply({ code: 200, message: responseMessage.trim() });
    }

    @Func(mng.ManagerService.FuncGetNoDepartmentUser.name)
    public async getNoDepartmentUser(@Req() req: any) {
        const users = await cds.ql.SELECT.from("Users").where({ department_id: null });
        return (req.results = {
            code: 200,
            message: "successfully",
            data: users,
        });
    }
}
