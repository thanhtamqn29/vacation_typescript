import "reflect-metadata";
import express from "express";
import { createCombinedHandler } from "cds-routing-handlers";
import cds from "@sap/cds";

import { HandleMiddleware } from "./middlewares/middlewareChecker";

export const application = async () => {
    const app = express();


    const hdl = createCombinedHandler({
        middlewares: [HandleMiddleware], 
        handler: [__dirname + "/entities/**/*.js", __dirname + "/functions/**/*.js"],
    });

    await cds.connect("db");
    await cds
        .serve("all")
        .in(app)
        .with(hdl);

    return app;
};
