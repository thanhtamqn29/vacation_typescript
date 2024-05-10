namespace mng;

using vacation from '../db/schema';


service ManagerService @(path: '/manage') {
    entity MngUsers         as projection on vacation.Users;

    @(Capabilites: {
        Insertable,
        Updateable
    })
    entity MngCalendar      as projection on vacation.Calendar;

    entity MngDepartments   as projection on vacation.Departments;
    entity MngRequests      as projection on vacation.Requests;
    entity MngNotifications as projection on vacation.Notifications;
    action invite(ids : array of String)             returns String;
    action createDepartment(departmentName : String) returns String;
};
