import {  Func,  Handler,  Jwt,  Req,  Use } from "cds-routing-handlers";
import {  AuthService } from "../entities";
import {  HandleMiddleware } from "../middlewares/handler.middleware";
import {  generateAccessToken,  verifyAccessToken,  verifyRefreshToken } from "../helpers/jwt";

@Handler()
@Use(HandleMiddleware)
export class AuthHandlers {
    @Func(AuthService.FuncRefresh.name)
    public async refresh(@Req() req: any, @Jwt() Jwt: string) {
        const decodedAccessToken : any = verifyAccessToken(Jwt);
        
        if (decodedAccessToken.exp) return req.error(400, "This access token is usable");

        const user = await cds.ql.SELECT.one.from(AuthService.Entity.Users).where({ ID: decodedAccessToken.id });

        if (!user) return req.error(404, "Couldn't find this user!");

        const decodedRefreshToken : any = verifyRefreshToken(user.refreshToken);

        if (!decodedRefreshToken.exp) return req.error(300, "Your token is on expiry, try login again!!");

        const newAccessToken = generateAccessToken(user);

        if (!newAccessToken) return req.reject(500, "Cannot create new access token!");

        req.reply({code: 200, "New Access Token": newAccessToken});
    }

    @Func(AuthService.FuncLogout.name)
    public async logout(@Req() req: any, @Jwt() Jwt: string) {
        const decoded : any = verifyAccessToken(Jwt);
        await cds.ql.UPDATE("Users").where({ ID: decoded.id }).set({ refreshToken: null });
        req.reply({
            code: 200,
            message: "Logout successfully!!"
        })
    }
}
