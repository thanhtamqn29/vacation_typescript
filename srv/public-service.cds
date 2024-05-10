namespace pbl;

using vacation from '../db/schema';


service PublicService @(path: '/public') {




  entity PblUsers as projection on vacation.Users;
  action login(username : String, password : String) returns String;

}
