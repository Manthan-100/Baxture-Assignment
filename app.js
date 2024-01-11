import express from "express";
import expressUpload from "express-fileupload";
import router from "./routes.js";
import cacheDb from "./database/cache-db.js";

class App {
    constructor() {
    this.PORT = 5000;

    this.configureApp()
        .then(async (app) => {
            await cacheDb.connect();
            console.log("2. Database connection is succesfull")
            return app;
        }) 
        .then((app) => {
            console.log("3. Configure Error Handler")
            return this.configureErrorHandler(app);
        })
        .then((app) => {
            return this.startServer(app);
        })
        .catch((error) => {
            console.error("Failed to initialize server!:", error);
        });
    }

    configureErrorHandler = (app) => {
		return new Promise((resolve, _) => {
			// 404
			app.use((req, res, next) => {
				return res.status(404).send({
					error: `Not found: ${req.url}`,
				});
			});
			// 500
			app.use((err, req, res, next) => {
				const { message } = err;
				return res.status(err.status || 500).send({ error: message });
			});

			resolve(app);
		});
    }

    configureApp() {
        return new Promise((resolve, reject) => {
            console.log("1. Configuring node-server");
            const app = express();
            app.use(expressUpload());
            app.use(`/api/v1`, router);
            resolve(app);
        });
    }

    startServer(app) {
        app.listen(this.PORT, () => {
            console.log(`Server listening at http://localhost:${this.PORT}/api/v1`);
        });
    }
}

export default new App();
