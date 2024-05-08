using vacation from '../db/schema';





service ManagerService @(path: '/manage') {
    entity Users          as projection on vacation.Users;
    entity Calendar       as projection on vacation.Calendar;
    entity Departments    as projection on vacation.Departments;
    entity RequestsManage as projection on vacation.Requests;
    entity Notifications  as projection on vacation.Notifications;
    action invite(ids : array of String) returns String;

};
