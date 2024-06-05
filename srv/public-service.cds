namespace pbl;

using vacation from '../db/schema';

type iasID {
  displayName : String;
  email       : String;
  firstname   : String;
  lastname    : String;
  name        : String;
  scopes      : String;
}

service PublicService @(path : '/public') {
  
  action checkingIASId(data : iasID) returns String;

}
