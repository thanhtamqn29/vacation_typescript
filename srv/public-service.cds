using vacation from '../db/schema';


service PublicService @(path: '/public') {


  entity Users as
    projection on vacation.Users {
      *
    }
    excluding {
      requests,
      department
    };

  action login(username : String, password : String) returns String;
}
