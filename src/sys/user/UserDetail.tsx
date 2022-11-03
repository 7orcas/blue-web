import { useContext, useReducer, FC, useState } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import TableMenu from '../component/table/TableMenu'
import PermissionDialog from '../role/PermissionDialog'
import Button from '../component/utils/Button'
import ButtonClose from '../component/utils/ButtonClose'
import TextField from '../component/utils/TextField'
import { BaseEntI } from '../definition/interfaces'
import { CONFIG, UserListI, UserEntI, UserRoleEntI } from './user'
import { useLabel, getObjectById, updateBaseList, updateBaseEntity, closeEditor, formatTs, maxLengthText } from '../component/editor/editorUtil'
import { EditorConfig, editorConfigReducer as roleConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { GridColDef } from '@mui/x-data-grid'
import { Checkbox } from '@mui/material'

/*
  CRUD Editor for user-role

  [Licence]
  Created 08.10.22
  @author John Stewart
 */

interface Props {
  editorConfig : EditorConfig<BaseEntI, BaseEntI>
  setEditorConfig : any
  id : number
  entity : UserEntI
  updateList: (entity : UserListI, field : string, value : any) => void
  updateEntity : (entity : UserEntI) => void
}
  
const UserDetail : FC<Props> = ({ 
      editorConfig,
      setEditorConfig,
      id, 
      entity, 
      updateList,
      updateEntity
    }) => {
  
  const { session, setSession, setMessage, configs, setConfigs } = useContext(AppContext) as AppContextI
  
  //State 
  var roleEdConf : EditorConfig<UserRoleEntI, UserEntI> = new EditorConfig()
  const [roleConf, setRoleConf] = useReducer(roleConfRed, roleEdConf) 
  const [dialog, setDialog] = useState(false)
  const config = configs.get(CONFIG)

  //Set the list from the entity permissions list
  const loadListRoles = () => {
    setRoleConf ({type: ECF.list, payload : entity.roles})
  }

  //Set Role Changes
  const updateRole = (entity : UserRoleEntI, field : string, value : any) => {
    updateBaseEntity(entity, field, value)
    setRoleConf ({type: ECF.entities, payload : new Map(roleConf.entities.set(entity.id, entity))})
    updateBaseList (roleConf, setRoleConf, entity.id, entity, setSession)
    
    //Update parent
    var lst : any = getObjectById(entity._caParent.id, editorConfig.list)
    if (lst !== null) {
      updateList (lst,'',null)
    }
  }

  //Process checkbox clicks
  const handleCheckboxClick = (id : number | undefined, field : string) => {
    if (id !== undefined) {
      var ent : UserRoleEntI | null = getObjectById(Number(id), roleConf.list)
      if (ent !== null) {
        type ObjectKey = keyof UserRoleEntI;
        const fieldX = field as ObjectKey
        updateRole (ent, field, !ent[fieldX])
      }
    }
  }

  //Close this editor
  const close = () => {
    closeEditor(editorConfig, setEditorConfig, id)
  }

  //Open and close dialog
  const handleDialog = () => {
    setDialog(!dialog)
  }

  //List Columns
  const roleColumns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: 'code', headerName: useLabel('role'), width: 100, type: 'string' },
    { field: 'descr', headerName: useLabel('desc'), width: 200, type: 'string' },
    { field: 'active', headerName: useLabel('active'), width: 60, type: 'boolean', editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.active}
          onChange={() => handleCheckboxClick(params.row.id, 'active')}
        />
      ),
    },
    { field: 'delete', headerName: useLabel('delete'), width: 60, type: 'boolean', editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.delete}
          onChange={() => handleCheckboxClick(params.row.id, 'delete')}
        />
      ),
    },
  ];

  return (
    <div key={id} >
      {/* <PermissionDialog 
        dialog={dialog}
        setDialog={setDialog}
        entity={entity}
        updateEntity={updateEntityX}
      /> */}
      <div className='editor'>
        <div className='menu-header'>
          <TableMenu>
            <div className='table-menu-item table-menu-label'>{entity.code}</div>
            <ButtonClose onClick={close} className='table-menu-right' />
          </TableMenu>
        </div>
        <div className='editor-detail'>

          <p>id:{entity.id} updated:{formatTs(entity.updated)}</p>
          
          <TextField
            field='code'
            label='userid'
            config={config}
            entity={entity}
            updateEntity={updateEntity}
            required={true}
            theme={session.theme}
          />
          <TextField
            field='orgs'
            config={config}
            entity={entity}
            updateEntity={updateEntity}
            required={true}
            theme={session.theme}
          />

          <p></p>

          <div>
            <div className='menu-header'>
              <TableMenu>
                <Button onClick={handleDialog} langkey='addrole' className='table-menu-item' />
              </TableMenu>
            </div>
            <Editor 
              style={{ height: '40vh', minWidth : 450, maxWidth : 450 }}
              editorConfig={roleConf}
              setEditorConfig={setRoleConf}
              listColumns={roleColumns}
              loadList={loadListRoles}
              updateList={updateRole}
              disableSelectionOnClick={true}
              checkboxSelection={false}
              useChangesPrompt={false}
            >
            </Editor>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetail