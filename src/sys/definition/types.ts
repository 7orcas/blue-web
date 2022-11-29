
/*
  Type definitions

  [Licence]
  Created 22.09.22
  @author John Stewart
*/


//Defined in Java. Keep in-sync!
export enum JsonResponseI {
  ok = 0,
  error = -1,
  invalid = -2,
  commitErrors = -3,
  notAuthorised = -4,
  noChange = 1,
  uploaded = 3,
  loggedIn = 0, //dummy, not actually returned
  loginRedirect = 4,
  loggedOut = 5
}

export enum EntityStatusType {
  valid = 0,
  changed = 1,
  delete = 2,
  invalid = 9,
}
