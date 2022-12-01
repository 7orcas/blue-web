
/*
Determine user permissions
If permission == null then always return true, ie its ignored

Created 17.11.22
[Licence]
@author John Stewart
*/


//Return is the user has Read permission
export const isCreate = (session : any, permission : string | null) : boolean => {
  var rtn = is(session, permission, 'C')
  return rtn
}

export const isRead = (session : any, permission : string | null) : boolean => {
  return is(session, permission, 'R')
}

export const isUpdate = (session : any, permission : string | null) : boolean => {
  var rtn = is(session, permission, 'U')
  return rtn
}

export const isDelete = (session : any, permission : string | null) : boolean => {
  return is(session, permission, 'D')
}

const is = (session : any, permission : string | null, action : string) : boolean => {
  if (permission === null || session.devAdmin) return true
  if (typeof session.permissions === 'undefined') return false
  var map : Map<string,string> = session.permissions
  var crud : string | undefined = map.get(permission)
  if (typeof crud === 'undefined') return false
  if (crud === '*') return true
  if (crud.indexOf(action) !== -1) return true
  return false
}