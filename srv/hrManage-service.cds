using { vacation as my } from '../db/schema';

service HrManagerService @(path: '/manage/manageHr') {
  entity Users as projection on my.Users;
  entity Requests as projection on my.Requests;
  entity UserRequests as
    select from my.Requests as r
    left outer join my.Users as u
      on r.user.ID = u.ID
    {
      key r.ID     as request_ID,
          r.status as request_status,
          u.ID     as user_ID,
          u.username,
          u.role,
          u.department.id ,
          u.department.departmentName,
          u.department.isHRDepartment,
          r.startDay,
          r.endDay,   
          r.reason,
          r.comment
    };
  function exportExcel () returns String;
}