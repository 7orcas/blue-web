import { useContext, useReducer, FC, useState } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import TableMenu, { TableMenuTab } from '../component/table/TableMenu'
import RoleDialog from './RoleDialog'
import Button from '../component/utils/Button'
import EntityInfo from '../component/utils/EntityInfo'
import TextField from '../component/utils/TextField'
import { BaseEntI } from '../definition/interfaces'
import { CONFIG, UserListI, UserEntI, UserRoleEntI, RoleListI, newUserRoleEnt, logoutUser } from './user'
import { PermissionListI } from '../role/role'
import { useLabel, getObjectById, updateBaseList, updateBaseEntity, closeEditor } from '../component/editor/editorUtil'
import { EditorConfig, editorConfigReducer as roleConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { EntityStatusType as Status } from '../definition/types'
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
  editable : boolean
}
  
const UserDetail : FC<Props> = ({ 
      editorConfig,
      setEditorConfig,
      id, 
      entity, 
      updateList,
      updateEntity,
      editable
    }) => {
  
  const { setSession, setMessage, configs } = useContext(AppContext) as AppContextI
  
  //State 
  var roleEdConf : EditorConfig<UserRoleEntI, UserEntI> = new EditorConfig()
  const [roleConf, setRoleConf] = useReducer(roleConfRed, roleEdConf) 
  var permEdConf : EditorConfig<PermissionListI, UserEntI> = new EditorConfig()
  const [permConf, setPermConf] = useReducer(roleConfRed, permEdConf) 

  const [dialog, setDialog] = useState(false)
  const [roles, setRoles] = useState(true)
  const config = configs.get(CONFIG)

  //Set the list from the entity role list
  const loadListRoles = () => {
    setRoleConf ({type: ECF.list, payload : entity.roles})
  }

  //Set the list from the entity permissions list
  const loadListPermissions = () => {
    setPermConf ({type: ECF.list, payload : entity.permissions})
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

  //Update role dialog selections
  const updateEntityRoles = (list : RoleListI[]) => {
    var tempId = editorConfig.tempId;

    entity.roles.forEach((p : UserRoleEntI) => p._caParent = null)
    entity.permissions.forEach((p : PermissionListI) => p._caParent = null)
    var entityX = JSON.parse(JSON.stringify(entity));

    for (var i=0;i<list.length;i++) {
      var found = false
      
      for (var j=0;j<entity.roles.length;j++) {
        if (entity.roles[j].roleId === list[i].id) found = true
      }
      
      if (!found) {
        var rec = newUserRoleEnt(list[i], tempId, entity)
        rec._caEntityStatus = Status.changed
        entityX.roles.push(rec)
        tempId -= 1
      }
        
      entityX.roles.forEach((p : UserRoleEntI) => p._caParent = entityX)
      entityX.permissions.forEach((p : PermissionListI) => p._caParent = entityX)
      setEditorConfig ({type: ECF.tempId, payload : tempId})
      setEditorConfig ({type: ECF.entities, payload : new Map(editorConfig.entities.set(entityX.id, entityX))})
      updateEntity(entityX)

      //Force a reselection of the user
      var eds1 = editorConfig.editors.map((i : number) => i) 
      var eds2 = editorConfig.editors.filter((i : number) => i !== entityX.id)
      setEditorConfig ({type: ECF.editors, payload : eds2})
      setTimeout(() =>  {
        setEditorConfig ({type: ECF.editors, payload : eds1})
      }, 100)
    }
  }

  //Process checkbox clicks
  const handleCheckboxClick = (id : number | undefined, field : string) => {
    if (!roles) {
      return;
    }

    if (id !== undefined) {
      var ent : UserRoleEntI | null = getObjectById(Number(id), roleConf.list)
      if (ent !== null) {
        type ObjectKey = keyof UserRoleEntI;
        const fieldX = field as ObjectKey
        updateRole (ent, field, !ent[fieldX])
      }
    }
  }

  const handleResetAttempts = () => {
    entity.attempts = 0
    updateEntity(entity) 
  }

  const handleLogout = () => {
    logoutUser(entity.id, setMessage)
  }

  //Close this editor
  const close = () => {
    closeEditor(editorConfig, setEditorConfig, id)
  }

  //Open and close dialog
  const handleDialog = () => {
    setDialog(!dialog)
  }

  const handleShowDisplay = () => {
    setRoles(!roles)
  }

  //Role List Columns
  const roleColumns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: 'code', headerName: useLabel('role'), width: 100, type: 'string' },
    { field: 'descr', headerName: useLabel('desc'), width: 200, type: 'string' },
    { field: 'active', headerName: useLabel('active'), width: 60, type: 'boolean', editable: editable, 
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.active}
          onChange={() => handleCheckboxClick(params.row.id, 'active')}
          disabled={!editable}
        />
      ),
    },
    { field: 'delete', headerName: useLabel('delete'), width: 60, type: 'boolean', editable: editable,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.delete}
          onChange={() => handleCheckboxClick(params.row.id, 'delete')}
          disabled={!editable}
        />
      ),
    },
  ];

  //Permission List Columns
  const permColumns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: 'code', headerName: useLabel('url-c'), width: 300, type: 'string' },
    { field: 'crud', headerName: useLabel('crud'), width: 100, type: 'string' },
  ];


  return (
    <div key={id} >
      <RoleDialog 
        dialog={dialog}
        setDialog={setDialog}
        entity={entity}
        updateEntity={updateEntityRoles}
      />
      <div className='editor'>
        <div className='menu-header'>
          <TableMenu>
            <TableMenuTab
              code={entity.code}
              close={close}
            >
              <Button onClick={handleResetAttempts} langkey='resetAtt' className='table-menu-item' />
              <Button onClick={handleLogout} langkey='logout' className='table-menu-item' disabled={!entity.loggedIn} />
            </TableMenuTab>
          </TableMenu>
        </div>
        <div className='editor-detail'>
          <EntityInfo
            entity={entity}
          />
          <div className='editor-block'>
            <TextField
              field='code'
              label='username'
              config={config}
              entity={entity}
              updateEntity={updateEntity}
              required={true}
            />
            <TextField
              field='password'
              type='password'            
              label='pw'
              config={config}
              entity={entity}
              updateEntity={updateEntity}
              required={true}
            />
            <TextField
              field='orgs'
              config={config}
              entity={entity}
              updateEntity={updateEntity}
              required={true}
            />
            <TextField
              field='lastLogin'
              type='timestamp'
              config={config}
              entity={entity}
              readonly={true}
            />
          </div>
         

          <div className='editor-table'>
            <div className='menu-header'>
              <TableMenu>
                <Button onClick={handleDialog} langkey='addrole' className='table-menu-item' disabled={!roles}/>
                <Button onClick={handleShowDisplay} langkey={!roles?'showroles':'showperms'} className='table-menu-item' />
              </TableMenu>
            </div>
            {roles && 
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
            }
            {!roles && 
              <Editor 
                style={{ height: '40vh', minWidth : 450, maxWidth : 450 }}
                editorConfig={permConf}
                setEditorConfig={setPermConf}
                listColumns={permColumns}
                loadList={loadListPermissions}
                updateList={updateRole}
                disableSelectionOnClick={true}
                checkboxSelection={false}
                useChangesPrompt={false}
              >
              </Editor>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetail