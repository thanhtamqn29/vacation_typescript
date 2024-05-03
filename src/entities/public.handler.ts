import { Handler, Req, BeforeCreate, AfterCreate } from "cds-routing-handlers";
import { PublicService } from "../entities";
import * as bcrypt from "bcryptjs";
import { calculateVacationDays } from "../helpers/leaveDayCalculation";

@Handler(PublicService.SanitizedEntity.Users)
export class PublicHandler {
    @BeforeCreate()
    public async hashPassword(@Req() req: any): Promise<void> {
        const { data } = req;
        const isInSystem = await SELECT.one.from("Users").where({ username: data.username });

        if (isInSystem) {
            req.reject(400, "User is already in the system");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.password = hashedPassword;
    }

    @AfterCreate()
    public async updateLeaveDay(@Req() req: any): Promise<void> {
        const { data } = req;
        await calculateVacationDays(data.ID);
    }
}
