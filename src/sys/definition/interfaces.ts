import { ClientStatusType } from "./types"

/*
  Entity Interfaces

  [Licence]
  Created 22.09.22
  @author John Stewart
*/


export interface BaseI {
  id: number //should not be changed
  orgNr: number
  code: string
  active: boolean
  delete: boolean
  clientStatus: ClientStatusType
}

export interface BaseListI extends BaseI {
  descr: string
  changed: boolean
}

export interface BaseEntI extends BaseI {
  originalValue: string | undefined
}