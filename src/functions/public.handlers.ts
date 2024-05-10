import { Action, Handler, Param, Req } from "cds-routing-handlers";
import { pbl, vacation } from "../entities";
import * as bcrypt from "bcryptjs";
import cds from "@sap/cds";
import { generateAccessToken, generateRefreshToken } from "../helpers/jwt";

@Handler()
export class PublicAction {
    @Action(pbl.PublicService.ActionLogin.name)
    public async loginAction(
        @Param(pbl.PublicService.ActionLogin.paramUsername) username: string,
        @Param(pbl.PublicService.ActionLogin.paramPassword) password: string,
        @Req() req: any
    ): Promise<any> {
        const user = await cds.ql.SELECT(vacation.Entity.Users).where({
            username: username,
        });
        
        if (!user || user.length !== 1) return req.error(401, "Invalid username or password", "");
        if (!user[0].status) return req.error(400, "Perhaps you are not allow to access to our system, contact admin about this issue!", "");

        if (!(await bcrypt.compare(password, user[0].password))) {
            return req.error(401, "Invalid password", "");
        }
        const accessToken = generateAccessToken(user[0]);
        const refreshToken = generateRefreshToken(user[0]);

        const updatedUser = await cds.ql.UPDATE(vacation.Entity.Users).where({ ID: user[0].ID }).set({ refreshToken: refreshToken });
        if (!updatedUser) {
            return req.error(500, "Failed to update the user's token.", "");
        }
        return req.reply({
            code: 200,
            message: "Login successfully",
            "Access Token": accessToken,
        });
    }
}
