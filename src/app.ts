import "reflect-metadata";
import express from "express";
import { createCombinedHandler } from "cds-routing-handlers";
import cds from "@sap/cds";
import cors from "cors";
import { HandleMiddleware } from "./middlewares/handler.middleware";

export const application = async () => {
 
    const app = express();
    const publicPath = ["pbl"];
    app.use(cors({ credentials: true, origin: "*" }));



    try {

        await cds.connect.to("db");

        
        await cds
            .serve("all")
            .in(app)
            .with((srv: any) => {
                const service = srv.name.split(".");

                const handlerConfig = {
                    handler: [__dirname + "/entities/**/*.js", __dirname + "/functions/**/*.js"],
                    middlewares: [],
                };

                if (!publicPath.includes(service[0])) {
                    handlerConfig.middlewares = [HandleMiddleware];
                }

                const hdl = createCombinedHandler(handlerConfig);
                return hdl(srv);
            });
    } catch (err) {
        console.error("Failed to connect to HANA database or serve CAP services", err);
        process.exit(1);
    }

    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error("Unhandled error:", err);
        res.status(500).send({ error: err });
    });

    return app;
};
