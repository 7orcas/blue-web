import { BaseEntI, initListBase, initEntBase, initParent, initEntBaseOV } from "../definition/interfaces"
import { EntityStatusType } from '../definition/types'
import { EditorConfig } from '../component/editor/EditorConfig'
import apiGet from '../api/apiGet'
import Message, { MessageType } from '../system/Message'
import { PermissionListI } from '../role/role'
import apiPut from '../api/apiPut'

/*
  User configurations.
  Includes
  - editor configuration
  - entity interfaces
  - get (data) functions

  [Licence]
  Created 01.11.22
  @author John Stewart
 */

export interface UserListI extends BaseEntI {
  attempts: number
  loggedIn : boolean
  maxAttemptsExceeded : boolean
  lastLogin: string
}

export interface UserEntI extends UserListI {
  password: string
  orgs: string
  roles : UserRoleEntI[]
  permissions : PermissionListI[]
}

export interface RoleListI extends BaseEntI {
  roleId: number 
  code: string
}  

//Immutatble
export interface UserRoleEntI extends BaseEntI {
  userId: number 
  roleId: number 
  code: string
}  

export const CONFIG = 'system.user.ent.EntUser'

export const editorConfigUser = () : EditorConfig<UserListI, UserEntI> => {
  var ed : EditorConfig<UserListI, UserEntI> = new EditorConfig<UserListI, UserEntI>()
  ed.EDITOR_TITLE = 'useradmin'
  ed.CONFIG_ENTITIES = [CONFIG,'system.user.ent.EntUserRole']
  ed.POST_URL = 'user/post'
  ed.EXCEL_URL = 'user/excel'
  return ed
}

// export const editorConfigRole = () : EditorConfig<RoleListI, RoleListI> => {
//   var ed : EditorConfig<RoleListI, RoleListI> = new EditorConfig()
//   ed.EDITOR_TITLE = 'roleadmin'
//   ed.CONFIG_ENTITIES = ['system.user.ent.EntRole']
//   ed.POST_URL = 'role/post'
//   ed.EXCEL_URL = 'role/excel'
//   return ed
// }


//Load User list and populate the fields
export const loadUserList = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet('user/list', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var list : Array<UserListI> = []

      for (const lst of data) {
        var ent : UserListI = {} as UserListI  
        initListBase(lst, ent)
        ent.attempts = lst.attempts
        ent.loggedIn = lst.loggedIn
        ent.maxAttemptsExceeded = lst.maxAttemptsExceeded
        ent.lastLogin = lst.lastLogin
        list.push (ent)
      }
      return list
    }
  } catch (err : any) { } 
}

//Load User Entity and populate the fields
export const loadUserEntity = async (
  id : number,
  setMessage : (m : Message) => void, 
  // eslint-disable-next-line no-empty-pattern
  setSession? : ({}) => void) => {

  try {
    const data = await apiGet(`user/get?id=${id}`, setMessage, setSession)

    if (typeof data !== 'undefined') {
      var ent : UserEntI = {} as UserEntI  
      initEntBase(data, ent)
      ent.attempts = data.attempts
      ent.maxAttemptsExceeded = data.maxAttemptsExceeded
      ent.lastLogin = data.lastLogin
      ent.loggedIn = data.loggedIn
      ent.password = data.password
      ent.orgs = data.orgs
      appendRoles(data.roles, ent)
      appendPermissions(data.permissions, ent)
      initEntBaseOV(ent)
      return ent
    }
  } catch (err : any) { } 
}

//Load Role list and populate the fields
export const loadRoleList = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet('role/list', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var list : Array<RoleListI> = []

      for (const l of data) {
        var ent : RoleListI = {} as RoleListI  
        initListBase(l, ent)
        list.push (ent)
      }

      return list
    }
  } catch (err : any) {
    console.log (err)
  } 
}

//Create new user entity
export const newUserEnt = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {
  
  try {
    const data = await apiGet('user/new', setMessage, setSession)
    
    if (typeof data !== 'undefined') {
      var ent : UserEntI = {} as UserEntI
      for (const lst of data) {
        initEntBase(lst, ent)
        ent.password = lst.password
        ent.attempts = lst.attempts
        ent.roles = []
      }
      return ent
    }

  } catch (err : any) {
    console.log (err)
  }
}

//Log a user out
export const logoutUser = async (
  id : number,
  setMessage : (m : Message) => void, 
  // eslint-disable-next-line no-empty-pattern
  setSession? : ({}) => void) => {

  try {
    var value = {id : id}
    const data = await apiPut('user/logout', value, setMessage, setSession)
    if (typeof data !== 'undefined') {
      var m = new Message()
      m.type = MessageType.message
      m.message = 'logouts'
      setMessage(m)
    }
  } catch (err : any) {
    console.log (err)
  }
}

//Create new user entity
// export const newRoleList = async (
//       setMessage : (m : Message) => void, 
//       // eslint-disable-next-line no-empty-pattern
//       setSession? : ({}) => void) => {

//   try {
//     const data = await apiGet('user/new', setMessage, setSession)

//     if (typeof data !== 'undefined') {
//       var ent : RoleListI = {} as RoleListI
//       for (const l of data) {
//         initEntBase(l, ent)
//         ent.crud = l.crud
//       }
//       return ent
//     }

//   } catch (err : any) {
//     console.log (err)
//   }
// }

//Create and populate new user user object
export const newUserRoleEnt = (p : RoleListI, tempId : number, parent: UserEntI) : UserRoleEntI => {
  var rp = {} as UserRoleEntI
  initEntBase (p, rp)
  rp.id = tempId
  rp.userId = parent.id
  rp.roleId = p.id
  initParent (rp, parent)
  return rp
}

//Append user-roles
export const appendRoles = (roles : any, ent: UserEntI) => {
  ent.roles = roles !== 'undefined'? roles : []
  ent.roles.map((p) => p._caEntityStatus = EntityStatusType.valid)
  for (var j=0;j<ent.roles.length;j++) {
    var p = ent.roles[j]
    initEntBase(p, p)
    initEntBaseOV(p)
    p._caParent = ent
  }
}

//Append user-permissions (derived from roles)
export const appendPermissions = (permissions : any, ent: UserEntI) => {
  ent.permissions = permissions !== 'undefined'? permissions : []
  ent.permissions.map((p) => p._caEntityStatus = EntityStatusType.valid)
  for (var j=0;j<ent.permissions.length;j++) {
    var p = ent.permissions[j]
    initEntBase(p, p)
    initEntBaseOV(p)
    p._caParent = ent
  }
}