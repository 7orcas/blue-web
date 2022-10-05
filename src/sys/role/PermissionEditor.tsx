import { useContext, useMemo, useReducer, useCallback } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import EditorLM from '../component/editor/Editor'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { loadListBase, loadNewBase, useLabel, updateBaseList, getObjectById, handleCommit } from '../component/editor/editorUtil'
import { EditorConfig, editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { PermissionListI } from './permission'
import { GridColDef } from '@mui/x-data-grid';
import { UsedI, entBaseOV } from '../definition/interfaces'

/*
  CRUD Editor for permissions

  [Licence]
  Created 05.10.22
  @author John Stewart
 */

const PermissionEditor = () => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
 
  //State 
  var ed : EditorConfig<PermissionListI, PermissionListI> = new EditorConfig()
  ed.CONFIG_ENTITIES = useMemo(() => ['system.role.ent.EntPermission'], [])
  ed.CONFIG_URL = 'permission/config'
  ed.LIST_URL = 'permission/list'
  ed.NEW_URL = 'permission/new'
  ed.POST_URL = 'permission/post'
  ed.EXCEL_URL = 'permission/excel'

  const [edConf, setEdConf] = useReducer(edConfRed, ed) 

  //Load list records
  const loadListOrg = async() => {
    let list : Array<PermissionListI> = []
    var data = await loadListBase(edConf.LIST_URL, list, setSession, setMessage)
    if (typeof data !== 'undefined') {
      for (var i=0;i<data.length;i++) {
        var org = list[i]
        org.crud = data[i].crud
        
      }
      setEdConf ({type: ECF.list, payload : list})
    }
  }

  //Create new entity
  const handleCreate = async () => {
    var l : PermissionListI = {} as PermissionListI
    var data = await loadNewBase(edConf.NEW_URL, l, setSession, setMessage)
   
    if (typeof data !== 'undefined') {
      l.crud = data[0].crud
      setEdConf ({type: ECF.list, payload : [l, ...edConf.list]})
    }
  }
  
  //Commit CUD operations
  const handleCommitX = async() => {
    try {
      handleCommit(edConf, setEdConf, edConf.POST_URL, null, setSession, setMessage)
    } catch (err : any) { } 
  }

  //Set Changes
  const updateList = (entity : PermissionListI, field : string, value : any) => {
    switch (field) {
      case 'code': entity.code = value; break
      case 'crud': entity.crud = value; break
    }
    //Load entity (required to facilitate processing)
    setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(entity.id, entity))})
    
    updateBaseList (edConf, setEdConf, entity.id, entity, setSession)
  }


  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, }, // hide: true },
    { field: 'orgNr', headerName: useLabel('orgnr-s'), type: 'number', width: 60 },
    { field: 'code', headerName: useLabel('url'), width: 300, type: 'string', editable: true, },
    { field: 'crud', headerName: useLabel('crud'), width: 60, type: 'string', editable: true,},
    { field: 'active', headerName: useLabel('active'), width: 60, type: 'boolean', editable: true, },
    { field: 'changed', headerName: useLabel('changed'), width: 60, type: 'boolean' },
  ];

  return (
    <div className='editor'>
      <div className='menu-header'>
        <TableMenu exportExcelUrl={edConf.EXCEL_URL}>
          <Button onClick={handleCommitX} langkey='save' className='table-menu-item' disabled={!session.changed}/>
          <Button onClick={handleCreate} langkey='new' className='table-menu-item' />
        </TableMenu>
      </div>
      <EditorLM 
        style={{ height: '80vh', minWidth : 700, maxWidth : 700 }}
        editorConfig={edConf}
        setEditorConfig={setEdConf}
        listColumns={columns}
        loadList={loadListOrg}
        updateList={updateList}
        disableSelectionOnClick={true}
      >
      </EditorLM>
    </div>
  )
}

export default PermissionEditor