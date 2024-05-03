import { Request, Service } from "@sap/cds/apis/services";

export interface HeaderCustom extends Request {
    headers: {
        authorization?: string;
    };
}

export interface DataCustom extends HeaderCustom {
    authentication: {
        id: string;
        role: string;
        department: number;
    };
    baseUrl: string;
    results: {
        code: number;
        message: string;
        data?: object[];
    };
    dataTransaction?: { id: string };
}



export interface getPath extends Service {
    path: string;
}
export interface DecodedResponse {
    id: string;
    role: string;
    exp: number;
    iat: number;
}
