
/*
Determine user permissions

Created 17.11.22
[Licence]
@author John Stewart
*/

//URL - Permission DELETE
// export interface UrlCrudI {
//   url: string
//   crud : string
// }

//Return is the user has Read permission
export const isCreate = (session : any, url : string) : boolean => {
  var rtn = is(session, url, 'C')
console.log ('isCreate ' + url + '=' + rtn)  
  return rtn
}

export const isRead = (session : any, url : string) : boolean => {
  return is(session, url, 'R')
}

export const isUpdate = (session : any, url : string) : boolean => {
  var rtn = is(session, url, 'U')
console.log ('isUpdate ' + url + '=' + rtn)  
  return rtn
}

export const isDelete = (session : any, url : string) : boolean => {
  return is(session, url, 'D')
}

const is = (session : any, url : string, action : string) : boolean => {
  if (typeof session.permissions === 'undefined') return false
  var map : Map<string,string> = session.permissions
  var crud : string | undefined = map.get(url)
  if (typeof crud === 'undefined') return false
  if (crud === '*') return true
  if (crud.indexOf(action) !== -1) return true
  return false
}