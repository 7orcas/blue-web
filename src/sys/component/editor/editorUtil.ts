import { SessionField } from '../../system/Session'
import apiGet from '../../api/apiGet'
import apiPost from '../../api/apiPost'
import useLabelX from '../../lang/useLabel'
import Moment from 'moment';
import Message, { MessageType } from '../../system/Message'
import { EditorConfig, EditorConfigField as ECF } from './EditorConfig'
import { EntityStatusType as Status } from '../../definition/types'
import { BaseEntI, entBaseOV, ConfigI, TS_FORMAT, TS_DISPLAY } from '../../definition/interfaces'
import { GridSelectionModel } from '@mui/x-data-grid'

/*
  Editor utility functions

  [Licence]
  Created 15.09.22
  @author John Stewart
*/

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

  if (edConf.CONFIG_URL.length === 0 || configs.size === 0) {
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

//Close the editor
export const closeEditor = <L extends BaseEntI, E extends BaseEntI>(
    edConf : EditorConfig<L, E>,
    setEdConf : any,    
    id : number) => {
    
  var ids : Array<number> = edConf.editors.slice()
  for (var j=0;j<ids.length;j++) {
    const index = ids.indexOf(id);
    if (index > -1) { 
      ids.splice(index, 1); 
    }
  }  
  setEdConf ({type: ECF.editors, payload : ids})
}

export const formatTs = (updated: string) : string => {
  return Moment(updated, TS_FORMAT).format(TS_DISPLAY)
}
 

//Update the editor list based on changes to the entities
export const updateBaseList = <L extends BaseEntI, E extends BaseEntI>(
    edConf : EditorConfig<L, E>,
    setEdConf : any,    
    id : number, 
    entity : E, 
    setSession : any) => {

  var x = entBaseOV(entity)
  var o = getObjectById(id, edConf.list)

  if (o !== null) {

    o.active = entity.active
    o.orgNr = entity.orgNr
    o.code = entity.code
    o.descr = entity.descr

    //Set status
    o._caEntityStatus = Status.valid
    if (entity.delete) {
      o._caEntityStatus = Status.delete
    }
    else if (o.code.length === 0) {
      o._caEntityStatus = Status.invalid
    }
    else if (entity._caOriginalValue !== x) {
      o._caEntityStatus = Status.changed
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
    for (i=0;i<newList.length;i++){
      if (newList[i]._caEntityStatus === Status.changed 
        || newList[i]._caEntityStatus === Status.delete) {
        setSession ({type: SessionField.changed, payload : true})
      }
    }
    
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

//Check if list contains invalid entities
export const containsInvalid = <L extends BaseEntI>(
      entList : L[],
      setMessage? : (m : Message) => void) => {
        
  for (var i=0;i<entList.length;i++){
    if (entList[i]._caEntityStatus === Status.invalid) {
      if (setMessage) {
        var m = new Message()
        m.type = MessageType.error
        m.message = 'saveError1'
        m.detail = 'saveErrorFix'
        setMessage(m)
      }
      return true
    }
  }
  return false
}

//Commit updates, reload entity list, return reselected list ids 
export const handleCommit = async <L extends BaseEntI, E extends BaseEntI>(
      entList : L[],
      edConf : EditorConfig<L, E>,
      setEdConf : any,        
      url: string,
      loadEntity : any,
      setMessage : (m : Message) => void,
      // eslint-disable-next-line no-empty-pattern
      setSession : ({}) => void) => {


  if (edConf.entities === null) return

  //Validate changes
  if (containsInvalid(entList, setMessage)) {
    return
  }

  //Remember deleted records
  var dIds : Array<number> = []
  for (var j=0;j<entList.length;j++) {
    var e = edConf.entities.get(entList[j].id)
    if (e !== null && e !== undefined && e.delete) {
      dIds.push(entList[j].id)
    }
  }
  
  var data = await apiPost(url, entList, setMessage, setSession)

  //Reset changes?
  if (data !== undefined){
    
    setEdConf ({type: ECF.load, payload : true})
    setSession ({type: SessionField.changed, payload : false})
    
    //Remove all editors and entities
    setEdConf ({type: ECF.editors, payload : []})
    setEdConf ({type: ECF.entities, payload : new Map()})  

    //Reselect open editor ids (if present) and remove deleted ones
    var ids : Array<number> = edConf.editors.slice()

    //remove deleted ids
    for (j=0;j<dIds.length;j++) {
      const index = ids.indexOf(dIds[j]);
      if (index > -1) { 
        ids.splice(index, 1); 
      }
    }  

    //if new entity (it has a negative id) find new id
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
          break
        }
      }  
    }
     
    return ids 
  }

}