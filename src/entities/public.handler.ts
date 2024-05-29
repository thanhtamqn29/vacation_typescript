import { Handler, Req, BeforeCreate, AfterCreate } from "cds-routing-handlers";
import { pbl } from "../entities";
import * as bcrypt from "bcryptjs";
import  cds  from "@sap/cds";

@Handler(pbl.PublicService.SanitizedEntity.PblUsers)
export class PublicHandler {
    @BeforeCreate()
    public async hashPassword(@Req() req: any): Promise<void> {
        const { data } = req;
        console.log(data);
        
        const isInSystem = await cds.ql.SELECT.one.from("Users").where({ username: data.username });
        console.log(isInSystem);
        
        if (isInSystem) {
            req.reject(400, "User is already in the system");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.password = hashedPassword;
    }
}
