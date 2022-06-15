import { Application } from "express";
import BaseHttpServer from "./BaseHttpSever";
import EmployeeRouter from "./routes/EmployeeRouter";
import PatrolRouter from "./routes/PatrolRouter";

export default class HttpServer extends BaseHttpServer {
    public bindRoutes (app: Application): Application {
        return app
            .use("/api/employees", this.employees())
            .use("/api/patrols", this.patrols());
    }

    private employees () {
        return new EmployeeRouter(this._dependency).getRouter();
    }

    private patrols () {
        return new PatrolRouter(this._dependency).getRouter();
    }
}
