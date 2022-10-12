import { useContext, useMemo, useReducer, useEffect } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { useLabel, updateBaseEntity, updateBaseList, getObjectById, handleCommit } from '../component/editor/editorUtil'
import { EditorConfig, editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { PermissionListI, loadPermissionList, newPermissionList } from './role'
import { GridColDef } from '@mui/x-data-grid'
import { Checkbox } from '@mui/material'
import { initEntBaseOV, entRemoveClientFields } from '../definition/interfaces'

/*
  CRUD Editor for permissions

  [Licence]
  Created 05.10.22
  @author John Stewart
 */

const PermissionEditor = () => {
  
  const { session, setSession, setTitle, setMessage } = useContext(AppContext) as AppContextI
    
  //State 
  var ed : EditorConfig<PermissionListI, PermissionListI> = new EditorConfig()
  ed.CONFIG_ENTITIES = useMemo(() => ['system.role.ent.EntPermission'], [])
  ed.CONFIG_URL = 'permission/config'
  ed.POST_URL = 'permission/post'
  ed.EXCEL_URL = 'permission/excel'

  const [edConf, setEdConf] = useReducer(edConfRed, ed) 

  useEffect(() => {
    setTitle('permadmin')
  },[setTitle])

  //Load list records
  const loadListPermission = async() => {
    var list = await loadPermissionList(setMessage, setSession)
    setEdConf ({type: ECF.list, payload : list})
  }

  //Create new entity
  const handleCreate = async () => {
    var l = await newPermissionList(setMessage, setSession)
    if (typeof l !== 'undefined') {
      setEdConf ({type: ECF.list, payload : [l, ...edConf.list]})
    }
  }
  
  //Commit CUD operations
  const handleCommitX = async() => {
    try {

      //Only send updates
      var entList : PermissionListI[] = []
      for (var i=0;i<edConf.list.length;i++){
        if (edConf.list[i]._caChanged === true) {
          var e = edConf.entities.get(edConf.list[i].id)
          if (e !== null && e !== undefined) {
            e = entRemoveClientFields(e)
            entList.push(e)
          }
        }
      }
      
      handleCommit(entList, edConf, setEdConf, edConf.POST_URL, null, setMessage, setSession)
    } catch (err : any) { } 
  }

  //Set Changes
  const updateList = (entity : PermissionListI, field : string, value : any) => {
    switch (field) {
      case 'crud': entity.crud = value; break
    }
    updateBaseEntity(entity, field, value)

    //Load entity (required to facilitate processing)
    setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(entity.id, entity))})
    
    updateBaseList (edConf, setEdConf, entity.id, entity, setSession)
  }

  //Process checkbox clicks
  const handleCheckboxClick = (id : number | undefined, field : string) => {
    if (id !== undefined) {
      var ent : PermissionListI | null = getObjectById(Number(id), edConf.list)
      if (ent !== null) {
        type ObjectKey = keyof PermissionListI;
        const fieldX = field as ObjectKey
        updateList (ent, field, !ent[fieldX])
      }
    }
  }

  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: 'orgNr', headerName: useLabel('orgnr-s'), type: 'number', width: 80, editable: true, },
    { field: 'code', headerName: useLabel('url-c'), width: 150, type: 'string', editable: true, },
    { field: 'descr', headerName: useLabel('desc'), width: 300, type: 'string', editable: true, },
    { field: 'crud', headerName: useLabel('crud'), width: 80, type: 'string', editable: true,},
    { field: 'active', headerName: useLabel('active'), width: 80, type: 'boolean', editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.active}
          onChange={() => handleCheckboxClick(params.row.id, 'active')}
        />
      ),
    },
    { field: 'delete', headerName: useLabel('delete'), width: 80, type: 'boolean', editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.delete}
          onChange={() => handleCheckboxClick(params.row.id, 'delete')}
        />
      ),
    },
  ];

  return (
    <div>
      <div className='menu-header'>
        <TableMenu exportExcelUrl={edConf.EXCEL_URL}>
          <Button onClick={handleCommitX} langkey='save' className='table-menu-item' disabled={!session.changed}/>
          <Button onClick={handleCreate} langkey='new' className='table-menu-item' />
        </TableMenu>
      </div>
      <Editor 
        style={{ height: '80vh', minWidth : 840, maxWidth : 840 }}
        editorConfig={edConf}
        setEditorConfig={setEdConf}
        listColumns={columns}
        loadList={loadListPermission}
        updateList={updateList}
        disableSelectionOnClick={true}
        checkboxSelection={false}
      >
      </Editor>
    </div>
  )
}

export default PermissionEditor