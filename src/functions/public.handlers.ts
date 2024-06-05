import { Action, Handler, Param, Req } from "cds-routing-handlers";
import { pbl, vacation } from "../entities";
import * as bcrypt from "bcryptjs";
import cds from "@sap/cds";
import { generateAccessToken, generateRefreshToken } from "../helpers/jwt";

@Handler()
export class PublicAction {
    @Action(pbl.PublicService.ActionCheckingIASId.name)
    public async checkingIAS(@Param(pbl.PublicService.ActionCheckingIASId.paramData) data: any, @Req() req: any): Promise<any> {

        
        const user = await cds.ql.SELECT.one.from("Users").where({
            ID: data.name,
        });

        if (!user) {
            await cds.ql.INSERT.into("Users").entries({
                ID: data.name,
                fullName: data.firstname + data.lastname,
            });
        }

        const checkedUser = await cds.ql.SELECT.one.from("Users").where({
            ID: data.name,
        });

        if (!checkedUser.status) return req.error(400, "Perhaps you are not allow to access to our system, contact admin about this issue!", "");

        const accessToken = await generateAccessToken(checkedUser);
        const refreshToken = await generateRefreshToken(checkedUser);

        const updatedUser = await cds.ql.UPDATE("Users").where({ ID: checkedUser.ID }).set({ refreshToken: refreshToken });
        if (!updatedUser) {
            return req.error(500, "Failed to update the user's token.", "");
        }
        
        return req.reply({
            code: 200,
            accessToken: accessToken,
        });
    }
}
