import { SessionReducer } from '../../system/Session'
import apiGet from '../../api/apiGet'
import apiPost from '../../api/apiPost'
import useLabelX from '../../lang/useLabel'
import Message, { MessageType } from '../../system/Message'
import { EntityStatusType as Status } from '../../definition/types';
import { BaseI, BaseListI, BaseEntI, initListBase, entBaseOV, ConfigI } from '../../definition/interfaces';
import { GridSelectionModel } from '@mui/x-data-grid';

/*
  Editor utility functions

  [Licence]
  Created 15.09.22
  @author John Stewart
*/

//Load a list and populate the base fields
export const loadListBase = async <T extends BaseListI>(url : string, list : Array<T>, setSession : any, setMessage : any) => {
  try {
    const data = await apiGet(url, setSession, setMessage)
    
    for (const l of data) {
      var base : T = {} as T  
      initListBase(l, base)
      list.push (base)
    }
    
    return data
  } catch (err : any) { } 
}


//Load a new list entity
export const loadNewBase = async <L extends BaseListI>(
      url : string, 
      list : L, 
      setSession : any, 
      setMessage : any) => {
  try {
    const data = await apiGet(url, setSession, setMessage)
    
    for (const l of data) {
      initListBase(l, list)
      list.entityStatus = Status.invalid
    }
    
    return data
  } catch (err : any) { } 
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
 * Load the entity's configuration
 */
export const loadConfiguration = async(
    configEntities : string [], 
    configUrl : string, 
    configs: Map<string, ConfigI>,
    setConfigs: any,
    setSession: any,
    setMessage: any
    ) => {
  for (var i=0;i<configEntities.length;i++) {
    var ce = configEntities[i]
    if (!configs.has(ce)) {
      var data = await apiGet(configUrl + '?entity=' + ce, setSession, setMessage)
      if (typeof data !== 'undefined') {
        setConfigs(new Map(configs.set(ce, data))) 
      }
    }
  }
} 


/**
 * Update the editor list
 * @param entity id 
 * @param updated entity 
 * @param list 
 * @param setList 
 * @param setSession
 */
export const updateBaseList = <T extends BaseListI, E extends BaseEntI>(
    id : number, 
    entity : E, 
    list : Array<T>, 
    setList : any,
    setSession : any) => {

  var x = entBaseOV(entity)
  var o = getObjectById(id, list)

  if (o !== null) {

    o.changed = entity.originalValue !== x
    o.active = entity.active
    o.orgNr = entity.orgNr
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
export const onListSelectionSetEditors = async <T extends BaseEntI>(
      ids : GridSelectionModel, 
      setEditors : any, 
      entities : Map<number, T>, 
      setEntities : any, 
      loadEntity : any) => {

  var editors: Array<number> = []

  //Iterate selected list ids
  if (ids !== null && typeof ids !== 'undefined') {
    ids.forEach((id) => editors.push(typeof id === 'number'? id : parseInt(id)))
  }

  //Load missing entities
  editors.forEach((id) => {
    if (!entities.has(id)) {
console.log('editors load' + id)                    
      loadEntity (id)
    }
  })
 
  setEditors(editors);
}


export const handleCommit = async <T extends BaseListI, E extends BaseEntI>(
      url: string,
      list : Array<T>, 
      setList : any,
      entities : Map<number, E>, 
      setSession: any,
      setMessage: (m : Message) => void
      ) => {


  if (entities === null) return

  //Validate changes
  for (var i=0;i<list.length;i++){
    if (list[i].entityStatus === Status.invalid) {
      var m = new Message()
      m.type = MessageType.error
      m.message = 'saveError1'
      m.detail = 'saveErrorFix'
      if (i===0) m.context = 'xxx' 
      setMessage(m)
      return
    }
  }

  //Only send updates
  var entList : E[] = []
  for (i=0;i<list.length;i++){
    if (list[i].changed === true) {
      var e = entities.get(list[i].id)
      if (e !== null && e !== undefined) {
        entList.push(e)
      }
    }
  }
  
  var data = await apiPost(url, entList, setSession, setMessage)

  //Reset changes?
  if (data !== undefined){
    return data
  }
  
}