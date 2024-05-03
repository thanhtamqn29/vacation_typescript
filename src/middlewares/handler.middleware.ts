import { ICdsMiddleware, Req, Jwt, Middleware, Next } from "cds-routing-handlers";
import { verifyAccessToken } from "../helpers/jwt";
import { DataCustom } from "../types/types";
import { OnEventHandler } from "@sap/cds/apis/services";

@Middleware()
export class HandleMiddleware implements ICdsMiddleware {
    public async use(@Req() req: DataCustom, @Jwt() jwt: string, @Next() next: OnEventHandler): Promise<any> {
        const decoded = verifyAccessToken(jwt);

        if (!decoded) {
            return req.error(400, "Couldn't find your token!", "");
        }

        if (!decoded.exp) {
            return req.error(401, "Your token is expired!", "");
        }

        const users = await cds.read("Users").where({ ID: decoded.id });

        if (!users || users.length === 0) {
            return req.error(404, "User not found!", "");
        }

        if (users.length > 1) {
            return req.error(400, "Something went wrong!", "");
        }

        const user = users[0];


        req.authentication = {
            id: decoded.id,
            role: decoded.role,
            department: user.department_id,
        };
        const service = req.path.split(".")
        
        if (service[0] === "ManagerService") {
            this.checkRoleForManagePath(req, service);
        }
    }

    private checkRoleForManagePath = async (req: DataCustom, service : Array<String>) => {
        if (req.authentication.role !== "manager") {
            return req.error(402, "You're not the manager", "");
        }

        if (service[1] === "Departments" && req.method === "POST") {
            const user = await cds.ql.SELECT.one.from("Users").where({ID : req.authentication.id})
            if (user.department_id) {
                 return req.error(402, "You're already in a department!", "");
            }
        }
    };
}
