import { useContext, useReducer, FC, useState } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import TableMenu from '../component/table/TableMenu'
import PermissionDialog from './PermissionDialog'
import Button from '../component/utils/Button'
import { RoleEntI, RolePermissionEntI, PermissionListI } from './role'
import { useLabel, getObjectById, updateBaseList, updateBaseEntity } from '../component/editor/editorUtil'
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
  id : number
  entity : RoleEntI
  updateList: (entity : RoleEntI, field : string, value : any) => void
  updateEntity : (id : number, list : PermissionListI[]) => void
}
  
const RoleDetail : FC<Props> = ({ 
      id, 
      entity, 
      updateList,
      updateEntity}) => {
  
  const { setSession } = useContext(AppContext) as AppContextI
   
  //State 
  var ed : EditorConfig<RolePermissionEntI, RoleEntI> = new EditorConfig()
  const [edConf, setEdConf] = useReducer(edConfRed, ed) 
  const [dialog, setDialog] = useState(false)

  //Set the list from the entity permissions list
  const loadListPermissions = () => {
    var list = entity.permissions
    setEdConf ({type: ECF.list, payload : list})
  }

  //Update entity
  const updateEntityX = (list : PermissionListI[]) => {
    updateEntity (id, list)
  }

  //Set Changes
  const updateListX = (entity : RolePermissionEntI, field : string, value : any) => {
    updateBaseEntity(entity, field, value)
    setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(entity.id, entity))})
    updateBaseList (edConf, setEdConf, entity.id, entity, setSession)
    
    //Update parent
    updateList (entity._caParent, '', null)
  }

  //Process checkbox clicks
  const handleCheckboxClick = (id : number | undefined, field : string) => {
    if (id !== undefined) {
      var ent : RolePermissionEntI | null = getObjectById(Number(id), edConf.list)
      if (ent !== null) {
        type ObjectKey = keyof RolePermissionEntI;
        const fieldX = field as ObjectKey
        updateListX (ent, field, !ent[fieldX])
      }
    }
  }

  //Open and close dialog
  const handleDialog = () => {
    setDialog(!dialog)
  }

  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: '_caChanged', headerName: useLabel('changed'), type: 'number', width: 50 },
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
      <PermissionDialog 
        dialog={dialog}
        setDialog={setDialog}
        updateEntity={updateEntityX}
      />
      <div className='menu-header'>
        <TableMenu>
          <div className='table-menu-item table-menu-label'>{entity.code}</div>
          <Button onClick={handleDialog} langkey='addperm' className='table-menu-item' />
        </TableMenu>
      </div>
      <Editor 
        style={{ height: '80vh', minWidth : 450, maxWidth : 450 }}
        editorConfig={edConf}
        setEditorConfig={setEdConf}
        listColumns={columns}
        loadList={loadListPermissions}
        updateList={updateListX}
        disableSelectionOnClick={true}
        checkboxSelection={false}
      >
      </Editor>
    </div>
  )
}

export default RoleDetail