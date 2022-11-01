import { BaseEntI, initListBase, initEntBase, initParent, initEntBaseOV } from "../definition/interfaces"
import { EntityStatusType } from '../definition/types'
import { EditorConfig } from '../component/editor/EditorConfig'
import apiGet from '../api/apiGet'
import Message from '../system/Message'

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

export interface RoleListI extends BaseEntI {
  crud: string
}

export interface UserRoleEntI extends BaseEntI {
  userId: number //Immutatble
}

export interface UserEntI extends BaseEntI {
  users : UserRoleEntI[]
}

export const editorConfigUser = () : EditorConfig<UserEntI, UserEntI> => {
  var ed : EditorConfig<UserEntI, UserEntI> = new EditorConfig()
  ed.EDITOR_TITLE = 'useradmin'
  ed.CONFIG_ENTITIES = ['system.user.ent.EntUser','system.user.ent.EntUserRole']
  ed.POST_URL = 'user/post'
  ed.EXCEL_URL = 'user/excel'
  return ed
}

export const editorConfigRole = () : EditorConfig<RoleListI, RoleListI> => {
  var ed : EditorConfig<RoleListI, RoleListI> = new EditorConfig()
  ed.EDITOR_TITLE = 'roleadmin'
  ed.CONFIG_ENTITIES = ['system.user.ent.EntRole']
  ed.POST_URL = 'role/post'
  ed.EXCEL_URL = 'role/excel'
  return ed
}


//Load User list and populate the fields
export const loadUserList = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet('user/list', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var list : Array<UserEntI> = []

      for (const l of data) {
        var ent : UserEntI = {} as UserEntI  
        initListBase(l, ent)
        list.push (ent)
        appendRoles(l.users, ent)
        initEntBaseOV(ent)
      }

      return list
    }
  } catch (err : any) { } 
}

//Load Role list and populate the fields
export const loadRoleList = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet('user/list', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var list : Array<RoleListI> = []

      for (const l of data) {
        var ent : RoleListI = {} as RoleListI  
        initListBase(l, ent)
        ent.crud = l.crud
        list.push (ent)
        initEntBaseOV(ent)
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
      for (const l of data) {
        initEntBase(l, ent)
        ent.users = []
      }
      return ent
    }

  } catch (err : any) {
    console.log (err)
  }
}

//Create new user entity
export const newRoleList = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet('user/new', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var ent : RoleListI = {} as RoleListI
      for (const l of data) {
        initEntBase(l, ent)
        ent.crud = l.crud
      }
      return ent
    }

  } catch (err : any) {
    console.log (err)
  }
}

//Create and populate new user user object
export const newUserRoleEnt = (p : RoleListI, tempId : number, parent: UserEntI) : UserRoleEntI => {
  var rp = {} as UserRoleEntI
  initEntBase (p, rp)
  rp.id = tempId
  rp.userId = p.id
  rp.crud = p.crud
  initParent (rp, parent)
  return rp
}

//Append users
export const appendRoles = (users : any, ent: UserEntI) => {
  ent.users = users !== 'undefined'? users : []
  ent.users.map((p) => p._caEntityStatus = EntityStatusType.valid)
  for (var j=0;j<ent.users.length;j++) {
    var p = ent.users[j]
    initEntBase(p, p)
    initEntBaseOV(p)
    p._caParent = ent
  }
}        