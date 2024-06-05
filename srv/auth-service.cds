namespace auth;


using vacation from '../db/schema';


service AuthService @(path : '/auth') {

  entity Users       as projection on vacation.Users;
  entity Departments as projection on vacation.Departments;
  function refresh() returns String;
  function logout()  returns String;
}
