using { vacation as my } from '../db/schema';

service HrManagerService @(path: '/manage/manageHr') {
  entity  Departments as projection on  my.Departments;
  entity UserRequests as
    select from my.Requests as r
    left outer join my.Users as u
      on r.user.ID = u.ID
    {
      key r.ID     as request_ID,
          r.status as request_status,
          u.ID     as user_ID,
          u.fullName,
          u.role,
          u.department.id ,
          u.department.departmentName,
          u.department.isHRDepartment,
          r.startDay,
          r.endDay,   
          r.reason,
          r.comment,
          r.dayOffType,
          r.shift,
          r.isOutOfDay,
    };
  function exportExcel () returns String;
}