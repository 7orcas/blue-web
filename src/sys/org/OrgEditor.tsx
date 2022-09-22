import { useState, useContext, useEffect, useMemo } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import OrgDetail from './OrgDetail'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { loadList, useLabel, updateList, onListSelectionSetEditors, getObjectById } from '../component/editor/editor'
import { OrgListI, OrgEntI, loadOrgEnt } from './org'
import { DataGrid, GridColDef, GridSelectionModel, GridCellParams, GridRowClassNameParams } from '@mui/x-data-grid';
import usePrompt from "../component/editor/usePrompt";
import { EntityStatusType as Status } from '../definition/types';
import { MessageType, MessageReducer } from '../system/Message'

import apiPost from '../api/apiPost'
import { BaseEntI, BaseListI } from '../definition/interfaces'

/*
  List, export and update organisations

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

const OrgEditor = () => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
  
  //Local State
  const [newId, setNewId] = useState (0)
  const [list, setList] = useState<OrgListI[]>([])  //left list of all records
  const [entities, setEntities] = useState<Map<number,OrgEntI>>(new Map()) //loaded full entities
  const [editors, setEditors] = useState<Array<number>>([])  //detailed editors
  
  //Warn the user of unsaved changes
  usePrompt(session.changed, setMessage);

  //Load records
  const loadListX = async() => {
    let list : Array<OrgListI> = []
    var data = await loadList('org/list', list, setSession, setMessage)
    if (typeof data !== 'undefined') {
      setList(list)
    }
  }

  //Initial load of base list
  useEffect(() => {
    loadListX()
  },[])


  //Load entity
  const loadOrgX = async(id : number) => {
    var entity : OrgEntI | undefined = await loadOrgEnt(id, setSession, setMessage)
    if (typeof entity !== 'undefined') {
      updateEntity(id, entity)
    }
  }

  const updateCallback = <L extends BaseListI, E extends BaseEntI>(list : L, entity : E) => {
console.log('updateCallback')
  }

  //Update list and entities state
  const updateEntity = (id : number, entity : OrgEntI) => {
    setEntities(new Map(entities.set(id, entity)))
    updateList (id, entity, list, updateCallback, setList, setSession)
  }

  //Set the list selections (to display editors)  
  const handleSelection = (ids : GridSelectionModel) => {
    onListSelectionSetEditors(ids, setEditors, entities, loadOrgX)
  }

  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50 },
    { field: 'orgNr', headerName: useLabel('orgnr-s'), type: 'number', width: 60 },
    { field: 'code', headerName: useLabel('code'), width: 200 },
    { field: 'active', headerName: useLabel('active'), width: 60, type: 'boolean' },
    { field: 'changed', headerName: useLabel('changed'), width: 60, type: 'boolean' },
  ];

  //Generate temp new ids (negative)
  const getNextNewId = () => {
    var id = newId - 1
    setNewId(id)
    return id
  }

  //ToDo get from server
  const handleCreate = () => {
    var l : OrgListI = {} as OrgListI
    l.id = getNextNewId() 
    l.orgNr = 0
    l.code = ''
    l.descr = ''
    l.active = true
    l.changed = true
    l.delete = false
    l.entityStatus = Status.invalid
    var newList = [l, ...list]
    setList (newList)
    
    var e : OrgEntI = {} as OrgEntI
    e.id = l.id
    e.code = ''
    e.active = l.active
    e.dvalue = false
    e.delete = l.delete
    e.entityStatus = l.entityStatus
    setEntities(new Map(entities.set(e.id, e)))

  }

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
      <div className='editor-multi-select'>
        <div className='editor-left table-grid'>
          <div style={{ height: '80vh', minWidth : 500, maxWidth : 500 }}>
            <DataGrid
              // sx={{color: 'yellow'}} //text color
              rows={list}
              columns={columns}
              pageSize={25}
              rowsPerPageOptions={[25]}
              checkboxSelection
              onSelectionModelChange={handleSelection}
              getRowClassName={(params) => `table-grid-status-${params.row.entityStatus}`}
              getCellClassName={(params: GridCellParams<number>) => {
                return 'table-cell';
              }}
            />
          </div>
        </div>
        {editors.map((id) => 
          <div key={id} className='editor-right'>
            <OrgDetail 
              key={id} 
              id={id}
              entity={entities.get(id)}
              updateEntity={updateEntity}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default OrgEditor