import { Handler,  Use } from "cds-routing-handlers";
import { ManagerService } from "../entities";
import { HandleMiddleware } from "../middlewares/middlewareChecker";

@Handler(ManagerService.SanitizedEntity.Calendar)
@Use()
