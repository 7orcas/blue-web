import { EntityStatusType } from "./types"

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
  entityStatus: EntityStatusType
}

export interface BaseListI extends BaseI {
  descr: string
  changed: boolean
}

export interface BaseEntI extends BaseI {
  originalValue: string | undefined
}

export interface ConfigFieldI  {
  name : string
  max? : number
  min? : number
  nonNull : boolean
}

export interface ConfigI  {
  fields: ConfigFieldI []
}
