import { Request } from "@sap/cds/apis/services"

export interface HeaderCustom extends Request {
    headers: {
        authorization? : string
    }
}

export interface DataCustom extends HeaderCustom {
    authentication : {
        id: string,
        role: string,
        department: number
    }
}
export interface RequestResponse extends Request {
    authentication : DataCustom
    results : Array<object> | object
}

export interface DecodedResponse {
    id: string,
    role : string,
    exp: number,
    iat: number
}