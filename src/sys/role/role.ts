import { BaseEntI, initListBase, initEntBase, initParent, initEntBaseOV } from "../definition/interfaces"
import { EntityStatusType } from '../definition/types'
import apiGet from '../api/apiGet'
import Message from '../system/Message'

/*
  Role entities

  [Licence]
  Created 05.10.22
  @author John Stewart
 */

export interface PermissionListI extends BaseEntI {
  crud: string
}

export interface RolePermissionEntI extends BaseEntI {
  permission_id: number //Immutatble
  crud: string //Immutatble
}

export interface RoleEntI extends BaseEntI {
  permissions : RolePermissionEntI[]
}

//Load Role list and populate the fields
export const loadRoleList = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet('role/list', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var list : Array<RoleEntI> = []

      for (const l of data) {
        var ent : RoleEntI = {} as RoleEntI  
        initListBase(l, ent)
        list.push (ent)
        appendPermissions(l.permissions, ent)
        initEntBaseOV(ent)
      }

      return list
    }
  } catch (err : any) { } 
}

//Load Permission list and populate the fields
export const loadPermissionList = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet('permission/list', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var list : Array<PermissionListI> = []

      for (const l of data) {
        var ent : PermissionListI = {} as PermissionListI  
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

//Create new role entity
export const newRoleEnt = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {
  
  try {
    const data = await apiGet('role/new', setMessage, setSession)
    
    if (typeof data !== 'undefined') {
      var ent : RoleEntI = {} as RoleEntI
      for (const l of data) {
        initEntBase(l, ent)
        ent.permissions = []
      }
      return ent
    }

  } catch (err : any) {
    console.log (err)
  }
}

//Create new permission entity
export const newPermissionList = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet('permission/new', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var ent : PermissionListI = {} as PermissionListI
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

//Create and populate new role permission object
export const newRolePermissionEnt = (p : PermissionListI, tempId : number, parent: RoleEntI) : RolePermissionEntI => {
  var rp = {} as RolePermissionEntI
  initEntBase (p, rp)
  rp.id = tempId
  rp.permission_id = p.id
  rp.crud = p.crud
  initParent (rp, parent)
  return rp
}

//Append permissions
export const appendPermissions = (permissions : any, ent: RoleEntI) => {
  ent.permissions = permissions !== 'undefined'? permissions : []
  ent.permissions.map((p) => p._caEntityStatus = EntityStatusType.valid)
  for (var j=0;j<ent.permissions.length;j++) {
    var p = ent.permissions[j]
    initEntBase(p, p)
    initEntBaseOV(p)
    p._caParent = ent
  }
}        