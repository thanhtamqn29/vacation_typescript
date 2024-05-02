import { ICdsMiddleware, Req, Jwt, Middleware } from "cds-routing-handlers";
import { verifyAccessToken } from "../helpers/jwt";
import { DataCustom } from "../types/types";

@Middleware({ global: false, priority: 0 })
export class HandleMiddleware implements ICdsMiddleware {
    public async use(@Req() req: DataCustom, @Jwt() jwt: string): Promise<any> {
        const event = (req.path ? req.path + " " : "") + req.event;
        console.log(event);

        const passingBy = this.eventWithoutGuard(event);

        if (passingBy === true) return;

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

        if (!user.department_id) {
            return req.error(400, "This user isn't in any department!", "");
        }

        return (req.authentication = {
            id: decoded.id,
            role: decoded.role,
            department: user.department_id,
        });
    }

    public async managerRole(@Req() req: DataCustom, @Jwt() Jwt: string): Promise<any> {
        await this.use(req, Jwt);
    }

    private eventWithoutGuard(event: string): boolean {
        const events = ["login", "AuthService.Users CREATE"];
        return events.includes(event);
    }
}
