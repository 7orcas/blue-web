import { BaseEntI, initEntBase, initParent } from "../definition/interfaces"

/*
  Role entity

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