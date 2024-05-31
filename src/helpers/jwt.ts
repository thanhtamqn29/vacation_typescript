import * as jwt from "jsonwebtoken";
import {pbl } from "../entities";





const generateAccessToken = async (user: pbl.PublicService.IPblUsers) => {
const accessTokenKey = await global.serverEnv?.accessToken;

    return jwt.sign(
        {
            id: user.ID,
            role: user.role,
            department_id:user.department_id,
        },
        accessTokenKey,
        { expiresIn: "1h" }
    );
};

const generateRefreshToken = async  (user: pbl.PublicService.IPblUsers) => {
const refreshTokenKey = await global.serverEnv?.refreshToken;

    return jwt.sign(
        {
            id: user.ID,
            role: user.role,
            department_id:user.department_id,
        },
        refreshTokenKey,
        { expiresIn: "30d" }
    );
};

const verifyAccessToken = async (token: string) => {
const accessTokenKey = await global.serverEnv?.accessToken;

    if (!token) return;
    try {
        const decoded = jwt.verify(token, accessTokenKey);

        return decoded;
    } catch (err) {
        const decoded: any = jwt.decode(token);
        return decoded ? { id: decoded.id } : null;
    }
};
const verifyRefreshToken = async(token: string) => {
const refreshTokenKey = await global.serverEnv?.refreshToken;

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
