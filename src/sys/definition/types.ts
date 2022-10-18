
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
  noChange = 1,
  uploaded = 3,
}

export enum EntityStatusType {
  valid = 0,
  changed = 1,
  delete = 2,
  invalid = 9,
}