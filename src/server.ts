import { application } from "./app";
import * as cron from "node-cron";
import { systemRunner } from "./helpers/runner";
import { executeDecreaseLeaveDay } from "./helpers/leaveDayCalculation";

export class Server {
    public static async run() {
        global.serverEnv = {
            accessToken: "123",
            refreshToken: "456",
        };

        const app = await application();

        // Run the server.
        const port = process.env.PORT || 4004;
        app.listen(port, async () => {
            cron.schedule("59 59 23 * * *", async () => {
                await systemRunner();
            });
            // Execute decrease leave day on the first day of every month
            cron.schedule("1 0 0 1 * *", async () => {
                try {
                    console.log("Running executeDecreaseLeaveDay job");
                    await executeDecreaseLeaveDay();
                    console.log("Completed executeDecreaseLeaveDay job");
                } catch (error) {
                    console.error("Error in executeDecreaseLeaveDay job:", error);
                }
            });
            console.info(`Server is listing at http://localhost:${port}`);
        });
    }
}

Server.run();
