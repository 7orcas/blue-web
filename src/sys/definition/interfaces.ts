import { EntityStatusType } from "./types"

/*
  Entity Interfaces

  [Licence]
  Created 22.09.22
  @author John Stewart
*/


export interface BaseEntI {
  id: number //Immutatble
  orgNr: number //Immutatble
  code: string
  descr: string
  active: boolean
  updated: string
  delete: boolean //@Transient field defined in ejb BaseEnt
  
  //Client attributes
  _caChanged: boolean  
  _caOriginalValue: string | undefined  
  _caEntityStatus: EntityStatusType 
  _caParent: any 
}

//Flag entities that are not used
export interface UsedI extends BaseEntI {}

//Populate base list fields
export const initListBase = (data : any, ent : BaseEntI) => {
  initBase (data, ent)
  ent._caChanged = false
}

//Populate base entity fields
export const initEntBase = (data : any, ent : BaseEntI) => {
  initBase (data, ent)
}

//Populate base fields
const initBase = (data : any, base : BaseEntI) => {
  base.id = data.id
  base.orgNr = data.orgNr
  base.code = typeof data.code !== 'undefined'? data.code : '?'
  base.descr = typeof data.descr !== 'undefined'? data.descr : ''
  base.active = typeof data.active !== 'undefined'? data.active : true
  base.updated = typeof data.updated !== 'undefined'? data.updated : null
  base.delete = false
  base._caEntityStatus = EntityStatusType.valid
  base._caParent = null
}

export const initParent = (child : BaseEntI, ent : BaseEntI) => {
  child._caParent = ent._caParent
}

export const initEntBaseOV = (ent : BaseEntI) => {
  ent._caOriginalValue = JSON.stringify(ent, jsonReplacer)
}

export const entBaseOV = (ent : BaseEntI) => {
  return JSON.stringify(ent, jsonReplacer)
}

export const entRemoveClientFields = <E extends BaseEntI>(ent : E) : E => {
  return JSON.parse(JSON.stringify(ent, jsonReplacer))
}

//When using JSON.stringify on entity, don't include the control fields
 export const jsonReplacer = (key : string, value : any) => {
  if (key === '_caOriginalValue' 
    || key === '_caEntityStatus'
    || key === '_caChanged'
    || key === '_caParent') {
    return undefined;
  } 
  return value;
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
