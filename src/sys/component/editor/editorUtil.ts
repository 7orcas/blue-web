import { SessionField } from '../../system/Session'
import apiGet from '../../api/apiGet'
import apiPost from '../../api/apiPost'
import useLabelX from '../../lang/useLabel'
import Message, { MessageType } from '../../system/Message'
import { EditorConfig, EditorConfigField as ECF } from './EditorConfig'
import { EntityStatusType as Status } from '../../definition/types';
import { BaseEntI, initListBase, entBaseOV, ConfigI, entRemoveClientFields } from '../../definition/interfaces';
import { GridSelectionModel } from '@mui/x-data-grid';

/*
  Editor utility functions

  [Licence]
  Created 15.09.22
  @author John Stewart
*/

//Load a list and populate the base fields
export const loadListBase = async <T extends BaseEntI>(
      url : string, 
      list : Array<T>,
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet(url, setMessage, setSession)
    
    for (const l of data) {
      var base : T = {} as T  
      initListBase(l, base)
      list.push (base)
    }
    
    return data
  } catch (err : any) { } 
}


//Load a new list entity
export const loadNewBase = async <L extends BaseEntI>(
      url : string, 
      list : L, 
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet(url, setMessage, setSession)
    
    for (const l of data) {
      initListBase(l, list)
      list.caEntityStatus = Status.invalid
    }
    
    return data
  } catch (err : any) { } 
}

//Return a label
export const useLabel = (key : string) => {
  return useLabelX(key)
}

//Return object by it's id
export const getObjectById = <T extends BaseEntI>(id : number, list : Array<T>) => {
  for (var i=0;i<list.length;i++){
    if (list[i].id === id) {
      return list[i]
    }
  }
  return null;
}

//Load the entity's configuration
export const loadConfiguration = async(
      edConf : EditorConfig<BaseEntI, BaseEntI>,
      configs: Map<string, ConfigI>,
      setConfigs: any,
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  if (edConf.CONFIG_URL.length === 0) {
    return
  }

  for (var i=0;i<edConf.CONFIG_ENTITIES.length;i++) {
    var ce = edConf.CONFIG_ENTITIES[i]
    if (!configs.has(ce)) {
      var data = await apiGet(edConf.CONFIG_URL + '?entity=' + ce, setMessage, setSession)
      if (typeof data !== 'undefined') {
        setConfigs(new Map(configs.set(ce, data))) 
      }
    }
  }
} 

//Set Base Field
export const updateBaseEntity = (entity : BaseEntI, field : string, value : any) => {
  switch (field) {
    case 'code': entity.code = value; break
    case 'descr': entity.descr = value; break
    case 'active': entity.active = value; break
    case 'delete': entity.delete = value; break
  }
}


//Update the editor list
export const updateBaseList = <L extends BaseEntI, E extends BaseEntI>(
    edConf : EditorConfig<L, E>,
    setEdConf : any,    
    id : number, 
    entity : E, 
    setSession : any) => {

  var x = entBaseOV(entity)
  var o = getObjectById(id, edConf.list)

  if (o !== null) {

    o.caChanged = entity.caOriginalValue !== x
    o.active = entity.active
    o.orgNr = entity.orgNr
    o.code = entity.code
    o.descr = entity.descr

    //Set status
    o.caEntityStatus = Status.valid
    if (entity.delete) {
      o.caEntityStatus = Status.delete
    }
    else if (o.code.length === 0) {
      o.caEntityStatus = Status.invalid
    }
    else if (o.caChanged) {
      o.caEntityStatus = Status.changed
    }

    var newList : L[] = []
    for (var i=0;i<edConf.list.length;i++){
      if (edConf.list[i].id === id) {
        newList.push(o)
      } else {
        newList.push(edConf.list[i])
      }
    }
    setEdConf ({type: ECF.list, payload : newList})
    
    //Set changed (eg to activate the Commit button)
    var changed = false
    for (i=0;i<newList.length;i++){
      if (newList[i].caChanged === true) {
        changed = true
        break
      } 
    }
    setSession ({type: SessionField.changed, payload : changed})
    
    return newList
  }
}

/**
 * Action a list multi-selection
 * - load entity if required
 * - store selected editors in state
 */
 export const onListSelectionSetEditors = async <L extends BaseEntI, E extends BaseEntI>(
    edConf : EditorConfig<L, E>,
    setEdConf : any,    
    ids : GridSelectionModel, 
    loadEntity : any) => {

  var editors: Array<number> = []

  //Iterate selected list ids
  if (ids !== null && typeof ids !== 'undefined') {
    ids.forEach((id) => editors.push(typeof id === 'number'? id : parseInt(id)))
  }

  //Load missing entities (if required)
  if (loadEntity !== null) {
    editors.forEach((id) => {
      if (!edConf.entities.has(id)) {
        loadEntity (id)
      }
    })
  }

  setEdConf ({type: ECF.editors, payload : editors})
}

//Commit updates, reload entity list, reselect list and reload entities
export const handleCommit = async <L extends BaseEntI, E extends BaseEntI>(
      edConf : EditorConfig<L, E>,
      setEdConf : any,        
      url: string,
      loadEntity : any,
      setMessage : (m : Message) => void,
      // eslint-disable-next-line no-empty-pattern
      setSession : ({}) => void) => {


  if (edConf.entities === null) return

  //Validate changes
  for (var i=0;i<edConf.list.length;i++){
    if (edConf.list[i].caEntityStatus === Status.invalid) {
      var m = new Message()
      m.type = MessageType.error
      m.message = 'saveError1'
      m.detail = 'saveErrorFix'
      setMessage(m)
      return
    }
  }

  //Remember deleted records
  var dIds : Array<number> = []
  for (var j=0;j<edConf.list.length;j++) {
    if (edConf.list[j].caChanged) {
      var e = edConf.entities.get(edConf.list[j].id)
      if (e !== null && e !== undefined && e.delete) {
        dIds.push(edConf.list[j].id)
      }
    }
  }

  //Only send updates
  var entList : E[] = []
  for (i=0;i<edConf.list.length;i++){
    if (edConf.list[i].caChanged === true) {
      e = edConf.entities.get(edConf.list[i].id)
      if (e !== null && e !== undefined) {
        entList.push(entRemoveClientFields(e))
      }
    }
  }
  
  var data = await apiPost(url, entList, setMessage, setSession)

  //Reset changes?
  if (data !== undefined){
    setEdConf ({type: ECF.load, payload : true})
    setSession ({type: SessionField.changed, payload : false})

    //Reselect newly created records (if present) and remove deleted ones
    setTimeout(() =>  {
      var ids : Array<number> = edConf.editors.slice()

      //deletes
      for (var j=0;j<dIds.length;j++) {
        const index = ids.indexOf(dIds[j]);
        if (index > -1) { 
          ids.splice(index, 1); 
        }
      }  

      //new
      for (var i=0;i<data.data.length;i++) {
        var id0 = data.data[i][0]
        var id1 = data.data[i][1]

        for (j=0;j<edConf.list.length;j++) {

          //remove temp id and add new id
          if (edConf.list[j].id === id0) {
            const index = ids.indexOf(id0);
            if (index > -1) { 
              ids.splice(index, 1); 
            }
            ids.push(id1)
            loadEntity(id1)
            break
          }
        }  
      }
      if (ids.length>0){
        setEdConf ({type: ECF.editors, payload : ids})
      }
    }, 500)
    return data
  }
  
}