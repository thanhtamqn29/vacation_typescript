import { ICdsMiddleware, Req, Jwt, Middleware } from "cds-routing-handlers";
import { verifyAccessToken } from "../helpers/jwt";
import { vacation } from "../entities";
@Middleware()
export class HandleMiddleware implements ICdsMiddleware {
    public async use(@Req() req: any, @Jwt() jwt: string): Promise<any> {
        const decoded: any = await verifyAccessToken(jwt);

        if (!decoded) {
            return req.error(400, "Couldn't find your token!", "");
        }
        if (!decoded.exp) return req.error(403, "Your token is expired");
        
        const [user] = await cds.ql.SELECT.from("Users").where({ ID: decoded.id });
        
        if (!user || user.length === 0) {
            return req.error(404, "User not found!", "");
        }

        if (user.length > 1) {
            return req.error(400, "Something went wrong!", "");
        }
        if (user.role === "staff" && !user.department_id) return req.error(400, "You are not in the department");

        req.authentication = {
            ID: decoded.id,
            role: decoded.role,
            department: user.department_id,
        };

        const service = req.req.originalUrl ? req.req.originalUrl.split("/") : null;

        const method = req.method;
        if (service && service[1] === "manage") {
            await this.checkRoleForManagePath(req, service);
        }

        await this.checkPendingRequest(req, service, method);
    }

    private checkRoleForManagePath = async (req: any, service: Array<String>) => {
        if (req.authentication.role !== "manager") {
            return req.error(402, "You're not the manager", "");
        }
        
        if (service[2] === "Departments" && req.method === "POST") {
            const user = await SELECT.one.from("Users").where({ ID: req.authentication.ID });
            
            if (user.department_id) {
                return req.error(402, "You're already in a department!", "");
            }
        }
    };

    private checkPendingRequest = async (req: any, service: Array<string>, method: string) => {
        if (service[2] === "EplRequests" && method === "POST") {

            const requests = await cds.ql.SELECT("Requests").where({ user_ID: req.authentication.ID });

            for (const request of requests) {
                if (request.status === "pending")
                    return req.error(400, "You already have a pending request, please try again when the manager accepted your request!", "");
            }
        }
    };
}
