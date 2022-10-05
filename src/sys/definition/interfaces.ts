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
  updated: string
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
  initBase (data, list)
  list.changed = false
}


//Populate base entity fields
export const initEntBase = (data : any, ent : BaseEntI) => {
  initBase (data, ent)
}

//Populate base fields
const initBase = (data : any, base : BaseI) => {
  base.id = data.id
  base.orgNr = data.orgNr
  base.code = typeof data.code !== 'undefined'? data.code : '?'
  base.descr = typeof data.descr !== 'undefined'? data.descr : ''
  base.active = typeof data.active !== 'undefined'? data.active : true
  base.updated = typeof data.updated !== 'undefined'? data.updated : null
  base.delete = false
  base.entityStatus = EntityStatusType.valid
}

export const initEntBaseOV = (ent : BaseEntI) => {
  ent.originalValue = JSON.stringify(ent, jsonReplacer)
}

export const entBaseOV = (ent : BaseEntI) => {
  return JSON.stringify(ent, jsonReplacer)
}

//When using JSON.stringify on entity, don't include the 'originalValue' field
 export const jsonReplacer = (key : string, value : any) => {
  if (key === 'originalValue') return undefined;
  else return value;
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
