import { DataGrid, GridColDef, GridSelectionModel, GridCellParams, GridRowParams, GridEventListener, GridValueGetterParams } from '@mui/x-data-grid';
import apiGet from '../../api/apiGet'
import useLabelX from '../../lang/useLabel'

/*
  Editor utility functions

  [Licence]
  Created 15.09.22
  @author John Stewart
*/


export interface BaseListI {
  id: number
  org: number
  code: string
  active: boolean
  descr: string
  changed: boolean
}

export const loadList = async <T extends BaseListI>(url : string, list : Array<T>, setSession : any, setMessage : any) => {
  try {
    const data = await apiGet(url, setSession, setMessage)
    
    for (const l of data) {
      var base : T = {} as T  
      base.id = l.id
      base.org = l.org
      base.code = l.code
      base.descr = ''
      base.active = l.active
      base.changed = false
      list.push (base)
    }
    
    return data
  } catch (err : any) { } 
}


export interface BaseEntI {
  id: number  //should not be changed
  org: number  //should not be changed
  code: string
  active: boolean
  originalValue: string | undefined
}

export const loadEnt = (data : any, ent : BaseEntI) => {
  ent.id = data.id
  ent.org = data.org
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
 * Return list object by it's id
 * @param id 
 * @param list 
 * @returns 
 */
export const getListObjectById = <T extends BaseListI>(id : number, list : Array<T>) => {
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
 * @param setChanged
 */
export const updateList = <T extends BaseListI, E extends BaseEntI>(
    id : number, 
    entity : E, 
    list : Array<T>, 
    setList : any,
    setChanged : any) => {

  var x = JSON.stringify(entity, jsonReplacer)
  var o = getListObjectById(id, list)

  if (o !== null) {
    o.changed = entity.originalValue !== x
    o.active = entity.active
    o.code = entity.code

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
    setChanged(false)
    for (i=0;i<newList.length;i++){
      if (newList[i].changed === true) {
        setChanged(true)
        return
      } 
    }

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
