import { Action, Handler, Param, Req, Func } from "cds-routing-handlers";
import { PublicService } from "../entities";
import * as bcrypt from "bcryptjs";
import cds from "@sap/cds";
import { generateAccessToken, generateRefreshToken } from "../helpers/jwt";

@Handler()
export class PublicAction {
    @Action(PublicService.ActionLogin.name)
    public async loginAction(
        @Param(PublicService.ActionLogin.paramUsername) username: string,
        @Param(PublicService.ActionLogin.paramPassword) password: string,
        @Req() req: any
    ): Promise<any> {
        const user = await cds.read(PublicService.Entity.Users).where({
            username: username,
        });

        if (!user || user.length !== 1) return req.error(401, "Invalid username or password", "");

        if (!(await bcrypt.compare(password, user[0].password))) {
            return req.error(401, "Invalid password", "");
        }
        const accessToken = generateAccessToken(user[0]);
        const refreshToken = generateRefreshToken(user[0]);

        const updatedUser = await cds.update(PublicService.Entity.Users).where({ ID: user[0].ID }).set({ refreshToken: refreshToken });
        if (!updatedUser) {
            return req.error(500, "Failed to update the user's token.", "");
        }
        return req.reply({
            code: 200,
            message: "Login successfully",
            "Access Token": accessToken,
        });
    }

    // @Func(PublicService.FuncRefresh.name)
    // public async refreshHandler(@Req() req: Request): Promise<any> {
    //     const decodedAccessToken = verifyAccessToken(req.headers.authorization);
    

    // const user = await SELECT.one
    //   .from(Users)
    //   .where({ ID: decodedAccessToken.id });
    // console.log(user);
    // if (!user) return req.reject(404, "Couldn't find this user!");

    // const decodedRefreshToken = verifyRefreshToken(user.refreshToken);
    // console.log(decodedRefreshToken);

    // if (!decodedRefreshToken.exp)
    //   return req.reject(300, "Your token is on expiry, try login again!!");

    // const newAccessToken = generateAccessToken(user);

    // if (!newAccessToken)
    //   return req.reject(500, "Cannot create new access token!");

    // req.results = {
    //   code: 200,
    //   data: newAccessToken,
    // };
    // }
}
