import "reflect-metadata";
import express from "express";
import { createCombinedHandler } from "cds-routing-handlers";
import cds from "@sap/cds";

import { HandleMiddleware } from "./middlewares/handler.middleware";

export const application = async () => {
    const app = express();
    const publicPath = ["pbl"];

    await cds.connect("db");

    await cds
        .serve("all")
        .in(app)
        .with((srv: any) => {
            const service = srv.name.split(".");

            if (publicPath.includes(service[0])) {
                const hdl = createCombinedHandler({
                    handler: [__dirname + "/entities/**/*.js", __dirname + "/functions/**/*.js"],
                });
                return hdl(srv);
            } else {
                const hdl = createCombinedHandler({
                    middlewares: [HandleMiddleware],
                    handler: [__dirname + "/entities/**/*.js", __dirname + "/functions/**/*.js"],
                });
                return hdl(srv);
            }
            // hdl(srv)
        });

    return app;
};
