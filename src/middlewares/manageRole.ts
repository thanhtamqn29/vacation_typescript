import { ICdsMiddleware, Req, Jwt, Middleware } from "cds-routing-handlers";
import { HandleMiddleware } from "./middlewareChecker";
import { DataCustom } from "../types/types";
@Middleware({global: false, priority: 0})
export class ManagerRole extends HandleMiddleware {
    super
}