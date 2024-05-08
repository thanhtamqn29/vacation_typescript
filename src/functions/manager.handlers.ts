import { Action, Handler, Param, Req, Use } from "cds-routing-handlers";
import { ManagerService } from "../entities";
import { HandleMiddleware } from "../middlewares/handler.middleware";

@Handler()
@Use(HandleMiddleware)
export class ManagerHandle {
    @Action(ManagerService.ActionInvite.name)
    public async invite(@Req() req: any, @Param(ManagerService.ActionInvite.paramIds) ids: string[]) {
        const user = await SELECT.one.from("Users").where({ ID: req.authentication.id });

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

        return req.reply({code: 200, message: responseMessage.trim()});
    }
}
