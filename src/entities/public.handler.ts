import { Handler, Req, BeforeCreate, AfterCreate } from "cds-routing-handlers";
import { pbl, vacation } from "../entities";
import * as bcrypt from "bcryptjs";

@Handler(pbl.PublicService.SanitizedEntity.PblUsers)
export class PublicHandler {
    @BeforeCreate()
    public async hashPassword(@Req() req: any): Promise<void> {
        const { data } = req;
        const isInSystem = await SELECT.one.from(vacation.Entity.Users).where({ username: data.username });

        if (isInSystem) {
            req.reject(400, "User is already in the system");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.password = hashedPassword;
    }

}
