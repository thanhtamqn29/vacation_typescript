export interface serverEnv extends Global {
    token: {
        accessToken: string;
        refreshToken: string;
    };
}
