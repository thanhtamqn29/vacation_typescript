import * as jwt from "jsonwebtoken";
import * as env from "dotenv";
import { AuthService, PublicService } from "../entities";

env.configDotenv();
const accessTokenKey = process.env.ACCESS_TOKEN;
const refreshTokenKey = process.env.REFRESH_TOKEN;

const generateAccessToken = (user: PublicService.IUsers) => {
    return jwt.sign(
        {
            id: user.ID,
            role: user.role,
        },
        accessTokenKey,
        { expiresIn: "30m" }
    );
};

const generateRefreshToken = (user: PublicService.IUsers) => {
    return jwt.sign(
        {
            id: user.ID,
            role: user.role,
        },
        refreshTokenKey,
        { expiresIn: "30d" }
    );
};

const verifyAccessToken = (token: string) => {
    if (!token) return;
    try {
        const decoded = jwt.verify(token, accessTokenKey);
        return decoded;
    } catch (err) {
        const decoded: any = jwt.decode(token);
        return decoded ? { id: decoded.id } : null;
    }
};
const verifyRefreshToken = (token: string) => {
    if (!token) return;
    try {
        const decoded = jwt.verify(token, refreshTokenKey);
        return decoded;
    } catch (err) {
        const decoded: any = jwt.decode(token);
        return decoded ? { id: decoded.id } : null;
    }
};

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
