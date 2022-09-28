import { EntityStatusType } from "./types"

/*
  Entity Interfaces

  [Licence]
  Created 22.09.22
  @author John Stewart
*/


export interface BaseI {
  id: number //Immutatble
  orgNr: number //Immutatble
  code: string
  descr: string
  active: boolean
  delete: boolean //Client attribute
  entityStatus: EntityStatusType //Client attribute
}

export interface BaseListI extends BaseI {
  changed: boolean  //Client attribute
}

export interface BaseEntI extends BaseI {
  originalValue: string | undefined  //Client attribute
}

//Populate base list fields
export const initListBase = (data : any, list : BaseListI) => {
  list.id = data.id
  list.orgNr = data.orgNr
  list.code = typeof data.code !== 'undefined'? data.code : '?'
  list.descr = typeof data.descr !== 'undefined'? data.descr : '?'
  list.active = typeof data.active !== 'undefined'? data.active : '?'
  list.delete = false
  list.changed = false
  list.entityStatus = EntityStatusType.valid
}


//Populate base entity fields
export const initEntBase = (data : any, ent : BaseEntI) => {
  ent.id = data.id
  ent.orgNr = data.orgNr
  ent.code = typeof data.code !== 'undefined'? data.code : '?'
  ent.descr = typeof data.descr !== 'undefined'? data.descr : '?'
  ent.active = typeof data.active !== 'undefined'? data.active : '?'
  ent.delete = false
  ent.entityStatus = EntityStatusType.valid
}


//Entity field contraints
export interface ConfigFieldI  {
  name : string
  max? : number
  min? : number
  nonNull : boolean
}

//Entity configuration
export interface ConfigI  {
  fields: ConfigFieldI []
}
