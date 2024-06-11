import * as cron from "node-cron";
import { addLeaveDay, executeDecreaseLeaveDay, recalculateLeaveDays, refreshDayOffLastYear } from "./leaveDayCalculation";

export const systemRunner = async () => {
    try {
        // Recalculate leave days on the last day of December
        cron.schedule("59 59 23 31 12 *", async () => {
            try {
                console.log("Running recalculateLeaveDays job");
                await recalculateLeaveDays();
                console.log("Completed recalculateLeaveDays job");
            } catch (error) {
                console.error("Error in recalculateLeaveDays job:", error);
            }
        });

        // Refresh day off last year on the last day of March
        cron.schedule("59 59 23 31 3 *", async () => {
            try {
                console.log("Running refreshDayOffLastYear job");
                await refreshDayOffLastYear();
                console.log("Completed refreshDayOffLastYear job");
            } catch (error) {
                console.error("Error in refreshDayOffLastYear job:", error);
            }
        });

        // Add leave day on the last day of every month
        cron.schedule("59 59 23 L * *", async () => {
            try {
                console.log("Running addLeaveDay job");
                await addLeaveDay();
                console.log("Completed addLeaveDay job");
            } catch (error) {
                console.error("Error in addLeaveDay job:", error);
            }
        });

     
    } catch (error) {
        console.error("Error scheduling tasks:", error);
    }
};
