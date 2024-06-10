import cds from "@sap/cds";
import { Handler, Req, Param, Action, Func, Use } from "cds-routing-handlers";
import { HrManagerService, mng } from "../entities";
import * as ExcelJS from "exceljs";
import * as path from "path";
import * as os from "os";
import createSheet from "../helpers/createSheet";
import { getAllDaysBetween, removeHolidays, filterDaysInCurrentMonth } from "../helpers/leaveDayCalculation";
@Handler()
export class HrManagerFunctionHandler {
    @Func(HrManagerService.FuncExportExcel.name)
    public async ExportExcelForHR(@Req() req: any): Promise<any> {
        const { authentication } = req;
        const hrStaff = await cds.ql.SELECT.one
            .from("Users")
            .columns(col => {
                col.ID,
                    col.username,
                    col.fullName,
                    col.address,
                    col.department(department => {
                        department.departmentName, department.isHRDepartment;
                    });
            })
            .where({
                ID: authentication.ID,
            });
        if (hrStaff.department.isHRDepartment !== true) {
            return req.reply("You're not from the HR department");
        }

        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const workbook = new ExcelJS.Workbook();
        const worksheet = createSheet(workbook, "Users");

        const allUsers = await SELECT.from("Users").where({ status: true });

        for (const user of allUsers) {
            const remainingDaysOff = user.dayOffThisYear + user.dayOffLastYear;
            const userRequestsThisMonth = await SELECT.from("Requests").where({
                user_ID: user.ID,
                status: "accepted",
            });

            const filteredRequests = userRequestsThisMonth.filter(request => {
                const startDate = new Date(request.startDay);
                const endDate = new Date(request.endDay);
                return (
                    (startDate >= firstDayOfMonth && startDate <= lastDayOfMonth) ||
                    (endDate >= firstDayOfMonth && endDate <= lastDayOfMonth) ||
                    (startDate <= firstDayOfMonth && endDate >= lastDayOfMonth)
                );
            });

            let days: any = [];
            for (const request of filteredRequests) {
                const startDay = new Date(request.startDay);
                const endDay = new Date(request.endDay);
                const daysBetween = getAllDaysBetween(startDay, endDay);
                days.push(...daysBetween);
            }
            days = await filterDaysInCurrentMonth(days);
            days = await removeHolidays(days);

            user.RemainingDaysOff = remainingDaysOff;
            user.DaysOffTaken = days.length;
            user.ListDayOff = days;

            worksheet.addRow({
                ID: user.ID,
                fname: user.fullName,
                address: user.address,
                role: user.role,
                RemainingDaysOff: user.RemainingDaysOff,
                DaysOffTaken: user.DaysOffTaken,
                ListDayOff: user.ListDayOff.join(", "),
            });
        }

        await workbook.xlsx.write(req.res);
    }
}
