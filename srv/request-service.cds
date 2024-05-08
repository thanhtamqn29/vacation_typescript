using vacation from '../db/schema';



@path: '/request'
service RequestService {

    @readonly
    entity Users         as projection on vacation.Users;

    @readonly
    entity Calendar      as projection on vacation.Calendar;

    @readonly
    entity Departments   as projection on vacation.Departments;

    entity Requests      as projection on vacation.Requests;
    entity Notifications as projection on vacation.Notifications;
}
