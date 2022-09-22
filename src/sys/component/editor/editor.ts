import { SessionReducer } from '../../system/Session'
import apiGet from '../../api/apiGet'
import useLabelX from '../../lang/useLabel'
import { EntityStatusType as Status } from '../../definition/types';
import { BaseI, BaseListI, BaseEntI } from '../../definition/interfaces';
import { GridSelectionModel } from '@mui/x-data-grid';

/*
  Editor utility functions

  [Licence]
  Created 15.09.22
  @author John Stewart
*/


export const loadList = async <T extends BaseListI>(url : string, list : Array<T>, setSession : any, setMessage : any) => {
  try {
    const data = await apiGet(url, setSession, setMessage)
    
    for (const l of data) {
      var base : T = {} as T  
      base.id = l.id
      base.orgNr = l.orgNr
      base.code = l.code
      base.descr = ''
      base.active = l.active
      base.changed = false
      base.entityStatus = Status.valid
      list.push (base)
    }
    
    return data
  } catch (err : any) { } 
}


export const loadEnt = (data : any, ent : BaseEntI) => {
  ent.id = data.id
  ent.orgNr = data.orgNr
  ent.code = data.code
  ent.active = data.active
}

/**
 * When using JSON.stringify on entity, don't include the 'originalValue' field
 * @param key 
 * @param value 
 * @returns 
 */
export const jsonReplacer = (key : string, value : any) => {
  if (key === 'originalValue') return undefined;
  else return value;
}

/**
 * Return a label
 * @param key 
 * @returns 
 */
export const useLabel = (key : string) => {
  return useLabelX(key)
}

/**
 * Return object by it's id
 * @param id 
 * @param list 
 * @returns 
 */
export const getObjectById = <T extends BaseI>(id : number, list : Array<T>) => {
  for (var i=0;i<list.length;i++){
    if (list[i].id === id) {
      return list[i]
    }
  }
  return null;
}

/**
 * Update the editor list
 * @param entity id 
 * @param updated entity 
 * @param list 
 * @param setList 
 * @param setSession
 */
export const updateList = <T extends BaseListI, E extends BaseEntI>(
    id : number, 
    entity : E, 
    list : Array<T>, 
    updateCallback : <L extends BaseListI, E extends BaseEntI>(list : L, entity : E) => void,
    setList : any,
    setSession : any) => {

  var x = JSON.stringify(entity, jsonReplacer)
  var o = getObjectById(id, list)

  if (o !== null) {

    o.changed = entity.originalValue !== x
    o.active = entity.active
    o.code = entity.code

    //Set status
    o.entityStatus = Status.valid
    if (entity.delete) {
      o.entityStatus = Status.delete
    }
    else if (o.code.length === 0) {
      o.entityStatus = Status.invalid
    }
    else if (o.changed) {
      o.entityStatus = Status.changed
    }

    updateCallback (o, entity)

    var newList : T[] = []
    for (var i=0;i<list.length;i++){
      if (list[i].id === id) {
        newList.push(o)
      } else {
        newList.push(list[i])
      }
    }
    setList(newList);

    //Set changed (eg to activate the Commit button)
    var changed = false
    for (i=0;i<newList.length;i++){
      if (newList[i].changed === true) {
        changed = true
        break
      } 
    }
    setSession ({type: SessionReducer.changed, payload : changed})
    
    return newList
  }
}

/**
 * Action a list multi-selection
 * - load entity if required
 * - store selected editors in state
 * @param ids 
 * @param setEditors 
 * @param entities 
 * @param loadEntity 
 */
export const onListSelectionSetEditors = <T extends BaseEntI>(ids : GridSelectionModel, setEditors : any, entities : Map<number, T>, loadEntity : any) => {
  let newEditors: Array<number> = []

  //Iterate selected list ids
  if (ids !== null && typeof ids !== 'undefined') {
    ids.forEach((id) => newEditors.push(typeof id === 'number'? id : parseInt(id)))
  }

  //Save selected ids for each editor in state
  newEditors.map((id) => {
    if (!entities.has(id)) {
      loadEntity (id)
    }
  })
  setEditors(newEditors);
}
