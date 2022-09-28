import { useState, useContext, useMemo } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import EditorLM from '../component/editor/EditorLM'
import OrgDetail from './OrgDetail'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { loadListBase, loadNewBase, useLabel, updateList, getObjectById } from '../component/editor/editor'
import { OrgListI, OrgEntI, loadOrgEnt } from './org'
import { GridColDef } from '@mui/x-data-grid';
import { EntityStatusType as Status } from '../definition/types';
import { MessageType, MessageReducer } from '../system/Message'
import apiPost from '../api/apiPost'
import { initEntBase } from '../definition/interfaces'

/*
  CRUD Editor for organisations

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

const OrgEditor = () => {
  
  const { session, setSession, setMessage, configs, setConfigs } = useContext(AppContext) as AppContextI
  
  const CONFIG_ENTITIES = useMemo(() => ['system.org.ent.EntOrg'], [])
  const CONFIG_URL = 'org/config'
  const LIST_URL = 'org/list'
  const NEW_URL = 'org/new'


  //Need State for editors
  const [list, setList] = useState<OrgListI[]>([])  //left list of all records
  const [editors, setEditors] = useState<Array<number>>([])  //detailed editors
  const [entities, setEntities] = useState<Map<number,OrgEntI>>(new Map()) //loaded full entities


  //Load list records
  const loadListOrg = async() => {
    let list : Array<OrgListI> = []
    var data = await loadListBase(LIST_URL, list, setSession, setMessage)
    if (typeof data !== 'undefined') {
      for (var i=0;i<data.length;i++) {
        var org = list[i]
        org.dvalue = data[i].dvalue
      }
      setList(list)
    }
  }

  //Load entity
  const loadEntityOrg = async(id : number) => {
    var entity : OrgEntI | undefined = await loadOrgEnt(id, setSession, setMessage)
    if (typeof entity !== 'undefined') {
      setEntities(new Map(entities.set(id, entity)))
      return entity
    }
  }

  //Create new entity
  const handleCreate = async () => {
    var l : OrgListI = {} as OrgListI
    var data = await loadNewBase(NEW_URL, l, setSession, setMessage)
   
    if (typeof data !== 'undefined') {
      l.dvalue = data[0].dvalue
      
      var e : OrgEntI = {} as OrgEntI
      initEntBase(l, e)
      e.dvalue = l.dvalue
      e.entityStatus = l.entityStatus
      
      setEntities(new Map(entities.set(e.id, e)))
      setList([l, ...list])
      return list
    }
  }

  //Update list and entities
  const updateEntity = (id : number, entity : OrgEntI) => {
    setEntities(new Map(entities.set(id, entity)))

    //Update the list object
    var l = getObjectById(id, list)
    if (l !== null) {
      l.dvalue = entity.dvalue
    }

    updateList (id, entity, list, setList, setSession)
  }
 
  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50 },
    { field: 'orgNr', headerName: useLabel('orgnr-s'), type: 'number', width: 60 },
    { field: 'code', headerName: useLabel('code'), width: 200 },
    { field: 'dvalue', headerName: useLabel('dvalue'), width: 60, type: 'boolean' },
    { field: 'active', headerName: useLabel('active'), width: 60, type: 'boolean' },
    { field: 'changed', headerName: useLabel('changed'), width: 60, type: 'boolean' },
  ];

  
  const handleUpdate = async() => {
    try {
      if (entities === null) return

      for (var i=0;i<list.length;i++){
        if (list[i].entityStatus === Status.invalid) {
          setMessage({ type: MessageReducer.type, payload: MessageType.error })
          setMessage({ type: MessageReducer.message, payload: 'there are errors' }) //ToDo
          setMessage({ type: MessageReducer.detail, payload: 'must be fixed before commit' }) //ToDo
          return
        }
      }

      var newList : OrgEntI[] = []
      for (var i=0;i<list.length;i++){
        if (list[i].changed === true) {
          var e = entities.get(list[i].id)
          if (e !== null && e !== undefined) {
            newList.push(e)
          }
        }
      }
      
      const d = await apiPost(`org/post`, newList, setSession, setMessage)
      
    } catch (err : any) { } 
  }
  

  return (
    <div className='editor'>
      <div className='menu-header'>
        <TableMenu exportExcelUrl='org/excel'>
          <Button onClick={handleUpdate} langkey='save' className='table-menu-item' disabled={!session.changed}/>
          <Button onClick={handleCreate} langkey='new' className='table-menu-item' />
        </TableMenu>
      </div>
      <EditorLM 
        configEntities={CONFIG_ENTITIES}
        configUrl={CONFIG_URL}
        listColumns={columns}
        loadList={loadListOrg}
        loadEntity={loadEntityOrg}
        list={list}
        setList={setList}
        entities={entities}
        setEntities={setEntities}
        editors={editors}
        setEditors={setEditors}
      >
        {editors.map((id) => 
          {typeof entities.get(id) !== 'undefined' ?
          <div key={id} className='editor-right'>
            <OrgDetail 
              key={id} 
              id={id}
              entity={entities.get(id)}
              updateEntity={updateEntity}
            />
          </div>
          : <div>problem</div>
          }
        )}
      </EditorLM>
     
      
    </div>
  )
}

export default OrgEditor