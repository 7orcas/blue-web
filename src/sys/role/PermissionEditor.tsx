import { useContext, useReducer } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import TableMenu from '../component/table/TableMenu'
import ButtonNew from '../component/utils/ButtonNew'
import ButtonSave from '../component/utils/ButtonSave'
import { isUpdate, isDelete } from '../system/Permission'
import { useLabel, updateBaseEntity, updateBaseList, getObjectById, handleCommit, containsInvalid } from '../component/editor/editorUtil'
import { editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { editorConfigPermission, PermissionListI, loadPermissionList, newPermissionList } from './role'
import { GridColDef } from '@mui/x-data-grid'
import { Checkbox } from '@mui/material'
import { entRemoveClientFields } from '../definition/interfaces'
import { EntityStatusType as Status } from "../definition/types"

/*
  CRUD Editor for permissions

  [Licence]
  Created 05.10.22
  @author John Stewart
 */

const PermissionEditor = () => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
    
  //State 
  const [edConf, setEdConf] = useReducer(edConfRed, editorConfigPermission()) 

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

      if (containsInvalid(edConf.list, setMessage)) {
        return
      }

      //Only send updates
      var entList : PermissionListI[] = []
      for (var i=0;i<edConf.list.length;i++){
        if (edConf.list[i]._caEntityStatus === Status.changed 
          || edConf.list[i]._caEntityStatus === Status.delete) {
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
  var editable = isUpdate(session, session.permission)
  var deleteable = isDelete(session, session.permission)
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: 'orgNr', headerName: useLabel('orgnr-s'), type: 'number', width: 80, editable: editable, },
    { field: 'code', headerName: useLabel('url-c'), width: 150, type: 'string', editable: editable, },
    { field: 'descr', headerName: useLabel('desc'), width: 300, type: 'string', editable: editable, },
    { field: 'crud', headerName: useLabel('crud'), width: 80, type: 'string', editable: editable,},
    { field: 'active', headerName: useLabel('active'), width: 80, type: 'boolean', editable: editable,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.active}
          onChange={() => handleCheckboxClick(params.row.id, 'active')}
          disabled={!editable}
        />
      ),
    },
    { field: 'delete', headerName: useLabel('delete'), width: 80, type: 'boolean', editable: deleteable,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.delete}
          onChange={() => handleCheckboxClick(params.row.id, 'delete')}
          disabled={!deleteable}
        />
      ),
    },
  ];

  return (
    <div className='editor'>
      <div className='menu-header'>
        <TableMenu exportExcelUrl={edConf.EXCEL_URL}>
          <ButtonSave onClick={handleCommitX} />
          <ButtonNew onClick={handleCreate} />
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