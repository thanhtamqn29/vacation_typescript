namespace auth;


using vacation from '../db/schema';


service AuthService @(path: '/auth') {


  function refresh() returns String;
  function logout()  returns String;
}
