import { useContext, useReducer, FC } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import TableMenu from '../component/table/TableMenu'
import { BaseEntI } from '../definition/interfaces'
import { RoleEntI, RolePermissionEntI } from './role'
import { useLabel } from '../component/editor/editorUtil'
import { EditorConfig, editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { GridColDef } from '@mui/x-data-grid'
import { Checkbox } from '@mui/material'

/*
  CRUD Editor for role-permissions

  [Licence]
  Created 08.10.22
  @author John Stewart
 */

interface Props {
  editorConfig : EditorConfig<BaseEntI, BaseEntI>
  setEditorConfig : any
  id : number
  entity : RoleEntI
  updateEntity : any
}
  
  

const RoleDetail : FC<Props> = ({ 
      editorConfig,
      setEditorConfig,
      id, 
      entity, 
      updateEntity}) => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
   
  //State 
  var ed : EditorConfig<RolePermissionEntI, RoleEntI> = new EditorConfig()
  const [edConf, setEdConf] = useReducer(edConfRed, ed) 

  //Set the list from the entity permissions list
  const loadListPermissions = () => {
    var list = entity.permissions
    setEdConf ({type: ECF.list, payload : list})
  }

  //Commit CUD operations
  const handleCommitX = async() => {
    // try {
    //   handleCommit(edConf, setEdConf, edConf.POST_URL, null, setSession, setMessage)
    // } catch (err : any) { } 
  }

  //Set Changes
  const updateList = (entity : RolePermissionEntI, field : string, value : any) => {
    // switch (field) {
    //   case 'crud': entity.crud = value; break
    // }
    // updateBaseEntity(entity, field, value)

    // //Load entity (required to facilitate processing)
    // setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(entity.id, entity))})
    
    // updateBaseList (edConf, setEdConf, entity.id, entity, setSession)
  }

  //Process checkbox clicks
  const handleCheckboxClick = (id : number | undefined, field : string) => {
    // if (id !== undefined) {
    //   var ent : PermissionListI | null = getObjectById(Number(id), editorConfig.list)
    //   if (ent !== null) {
    //     type ObjectKey = keyof PermissionListI;
    //     const fieldX = field as ObjectKey
    //     updateList (ent, field, !ent[fieldX])
    //   }
    // }
  }

  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: 'orgNr', headerName: useLabel('orgnr-s'), type: 'number', width: 40, hide: true },
    { field: 'code', headerName: useLabel('url-c'), width: 100, type: 'string' },
    { field: 'descr', headerName: useLabel('desc'), width: 150, type: 'string' },
    { field: 'crud', headerName: useLabel('crud'), width: 60, type: 'string' },
    { field: 'active', headerName: useLabel('active'), width: 50, type: 'boolean', editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.active}
          onChange={() => handleCheckboxClick(params.row.id, 'active')}
        />
      ),
    },
    { field: 'delete', headerName: useLabel('delete'), width: 50, type: 'boolean', editable: true,
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
        <TableMenu>
          <div className='table-menu-item'>{entity.code}</div>
        </TableMenu>
      </div>
      <Editor 
        style={{ height: '80vh', minWidth : 410, maxWidth : 410 }}
        editorConfig={edConf}
        setEditorConfig={setEdConf}
        listColumns={columns}
        loadList={loadListPermissions}
        updateList={updateList}
        disableSelectionOnClick={true}
        checkboxSelection={false}
      >
      </Editor>
    </div>
  )
}

export default RoleDetail