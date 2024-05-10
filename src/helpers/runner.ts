import * as cron from "node-cron";
import { addLeaveDay, recalculateLeaveDays, refreshDayOffLastYear } from "./leaveDayCalculation";

export const systemRunner = async () => {
    try {
        // Recalculate leave days on the last day of December
        cron.schedule("59 59 23 31 12 *", async () => {
            await recalculateLeaveDays();
        });

        // Refresh day off last year on the last day of March
        cron.schedule("59 59 23 31 3 *", async () => {
            await refreshDayOffLastYear();
        });

        // Add leave day on the last day of every month
        cron.schedule("59 59 L * *", async () => {
            await addLeaveDay();
        });
    } catch (error) {
        console.error("Error scheduling tasks:", error);
    }
};
