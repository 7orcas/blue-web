import { BaseEntI } from "../definition/interfaces"

/*
  Role entity

  [Licence]
  Created 05.10.22
  @author John Stewart
 */

export interface RoleListI extends BaseEntI {
}


export interface RoleEntI extends BaseEntI {
}

export interface RolePermissionEntI extends BaseEntI {
  permission_id: number //Immutatble
  crud: string
}