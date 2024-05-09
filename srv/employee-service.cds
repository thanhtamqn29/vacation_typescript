namespace epl;



using vacation from '../db/schema';




service EmployeeService @(path: '/request') {

    @readonly
    entity EplUsers         as projection on vacation.Users;

    @readonly
    entity EplCalendar      as projection on vacation.Calendar;

    @readonly
    entity EplDepartments   as projection on vacation.Departments;

    entity EplRequests      as projection on vacation.Requests;
    entity EplNotifications as projection on vacation.Notifications;
}
