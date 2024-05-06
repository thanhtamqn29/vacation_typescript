import "reflect-metadata";
import express from "express";
import { createCombinedHandler } from "cds-routing-handlers";
import cds from "@sap/cds";

import { HandleMiddleware } from "./middlewares/handler.middleware";
import { getPath } from "./types/types";

export const application = async () => {
    const app = express();
    await cds.connect.to("db");
    await cds
        .serve("all")
        .in(app)
        .with((srv: getPath) => {
            if (srv.path === "/public") {
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
        });

    return app;
};
