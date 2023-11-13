import express from "express";
import { json } from "express";
import fileupload from "express-fileupload";
import appConfig from "./configs/app";
import { getRouters } from "./routers";
import helmet from "helmet";
import compression from "compression";
import { customCorsHandler } from "./middleware/cors";

const app = express();
addFileUploadingMiddleware();
addHelmet();
addCors();
addBodyParser();
addCompression();
addRoutes();
handleUnMatchedRoutes();

app.listen(appConfig.port, "0.0.0.0", onAppStarted);

function addRoutes() {
  app.use("/api", getRouters());
}

function addBodyParser() {
  app.use(json());
}

function addCors() {
  app.use(customCorsHandler);
}

function addCompression() {
  app.use(compression());
}

function addHelmet() {
  app.use(helmet());
}

function addFileUploadingMiddleware() {
  app.use(
    fileupload({
      createParentPath: true,
    })
  );
}

function handleUnMatchedRoutes() {
  app.all("*", (req: any, res: any) => {
    res.status(400).send({
      message: "no matching route found",
      status: 404,
    });
  });
}

async function onAppStarted() {
  const { AppDataSource } = require("./orm/ormconfig");

  await AppDataSource.initialize();
  if (!AppDataSource.isInitialized) {
    throw new Error("cannot connect to the database");
  }
  console.log(`app running on http://localhost:${appConfig.port}`);
}
