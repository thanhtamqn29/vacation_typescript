import cds from '@sap/cds';
import { Handler, Req, Param, Action, Func, Use } from "cds-routing-handlers";
import {HrManagerService,mng} from "../../entities";
import * as ExcelJS from 'exceljs';
import {getAllDaysBetween, removeHolidays,filterDaysInCurrentMonth} from "../../helpers/leaveDayCalculation";
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
                    col.department((department:mng.ManagerService.IMngDepartments) => {
                        department.departmentName, department.isHRDepartment;
                    });
            })
            .where({
                ID: authentication.id,
            });

        if (hrStaff.department.isHRDepartment !== true) {
            return req.reply("You're not from the HR department");
        }
        
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
        const filePath =`C://Users//teri.vo//Documents//Excel_Report//Report_${currentMonth}_${currentYear}.xlsx`;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Users");
    
        worksheet.columns = [
          { header: "ID", key: "ID", width: 15 },
          { header: "FullName", key: "fname", width: 15 },
          { header: "Address", key: "address", width: 25 }, 
          { header: "Role", key: "role", width: 10 },
          { header: "Remaining DaysOff", key: "RemainingDaysOff", width: 10 },
          { header: "DaysOff Taken", key: "DaysOffTaken", width: 10 },
          { header: "List DayOff", key: "ListDayOff", width: 10 },
        ];
    
     
       
    
        const allUsers = await SELECT.from('Users').where({ isActive: true });
    
        for (const user of allUsers) {
            const remainingDaysOff = user.dayOffThisYear + user.dayOffLastYear;
            const userRequestsThisMonth = await SELECT.from('Requests').where({
                user_ID: user.ID,
                status: "accepted",
            });
            
            const filteredRequests = userRequestsThisMonth.filter((request) => {
                const startDate = new Date(request.startDay);
                const endDate = new Date(request.endDay);
                return (
                    (startDate >= firstDayOfMonth && startDate <= lastDayOfMonth) ||
                    (endDate >= firstDayOfMonth && endDate <= lastDayOfMonth) ||
                    (startDate <= firstDayOfMonth && endDate >= lastDayOfMonth)
                );
            });
    
            let days:any = [];
            for (const request of filteredRequests) {
                const startDay = new Date(request.startDay);
                const endDay = new Date(request.endDay);
                const daysBetween = getAllDaysBetween(startDay, endDay);
                days.push(...daysBetween);
            }
            days =await filterDaysInCurrentMonth(days);
            console.log(days);
            
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
                ListDayOff: user.ListDayOff.join(', '),
            });
        }
    
        await workbook.xlsx.writeFile(filePath);
        console.log(200,"Export excel successfully!");
    
    
    }
}