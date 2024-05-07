import { ICdsMiddleware, Req, Jwt, Middleware } from "cds-routing-handlers";
import { verifyAccessToken } from "../helpers/jwt";

@Middleware()
export class HandleMiddleware implements ICdsMiddleware {
    public async use(@Req() req: any, @Jwt() jwt: string): Promise<any> {
        const decoded: any = verifyAccessToken(jwt);

        if (!decoded) {
            return req.error(400, "Couldn't find your token!", "");
        }
        if (!decoded.exp) return req.error(403, "Your token is expired");

        const users = await cds.ql.SELECT("Users").where({ ID: decoded.id });

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

        const service = req.req.originalUrl ? req.req.originalUrl.split("/") : null;

        if (service && service[1] === "manage") {
            this.checkRoleForManagePath(req, service);
        }
    }

    private checkRoleForManagePath = async (req: any, service: Array<String>) => {
        if (req.authentication.role !== "manager") {
            return req.error(402, "You're not the manager", "");
        }

        if (service[2] === "Departments" && req.method === "POST") {
            const user = await cds.ql.SELECT.one.from("Users").where({ ID: req.authentication.id });
            if (user.department_id) {
                return req.error(402, "You're already in a department!", "");
            }
        }
    };
}
