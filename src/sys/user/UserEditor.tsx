import './user.css'
import { useContext, useReducer } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { editorConfigRole, RoleEntI, PermissionListI, loadRoleList, newRoleEnt, newRolePermissionEnt, RolePermissionEntI } from './user'
import Editor from '../component/editor/Editor'
import RoleDetail from './UserDetail'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { useLabel, updateBaseEntity, updateBaseList, getObjectById, handleCommit, containsInvalid } from '../component/editor/editorUtil'
import { editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { GridColDef } from '@mui/x-data-grid'
import { Checkbox } from '@mui/material'
import { entRemoveClientFields } from '../definition/interfaces'
import { EntityStatusType as Status } from '../definition/types'


/*
  CRUD Editor for roles

  [Licence]
  Created 05.10.22
  @author John Stewart
 */

const RoleEditor = () => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
  
  //State 
  const [edConf, setEdConf] = useReducer(edConfRed, editorConfigRole()) 
 
  //Load list records
  const loadListRole = async() => {
    var list = await loadRoleList(setMessage, setSession)
    if (typeof list !== 'undefined') {
      setEdConf ({type: ECF.list, payload : list})

      var m = new Map()
      for (var i=0;i<list.length;i++) {
        m.set(list[i].id, list[i])
      }
      // setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(list[i].id, list[i]))})    
      setEdConf ({type: ECF.entities, payload : m})
    }
  }

  //Load entity (from list object)
  const loadEntityRole = (id : number) => {
    var l : RoleEntI | null = getObjectById(id, edConf.list)
    if (l !== null) {
      setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(id, l))})  
      return l
    }
  }

  //Update list and entities
  const updateEntity = (id : number, entity : RoleEntI) => {
    setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(id, entity))})
    var list : RoleEntI | null = getObjectById(id, edConf.list)
    if (list !== null) {
      list.permissions = entity.permissions
    }
    updateBaseList (edConf, setEdConf, id, entity, setSession)
  }

  //Update permission dialog selections
  const updateEntityPermissions = (id : number, list : PermissionListI[]) => {
    var entity : RoleEntI | null = getObjectById(id, edConf.list)
    var tempId = edConf.tempId;

    if (entity !== null) {

      entity.permissions.forEach((p : RolePermissionEntI) => p._caParent = null)

      var entityX = JSON.parse(JSON.stringify(entity));
      for (var i=0;i<list.length;i++) {
        var found = false
        
        for (var j=0;j<entity.permissions.length;j++) {
          if (entity.permissions[j].permissionId === list[i].id) found = true
        }

        if (!found) {
          var rp = newRolePermissionEnt(list[i], tempId, entity)
          rp._caEntityStatus = Status.changed
          entityX.permissions.push(rp)
          tempId -= 1
        }
      }
      
      entityX.permissions.forEach((p : RolePermissionEntI) => p._caParent = entityX)

      setEdConf ({type: ECF.tempId, payload : tempId})
      updateEntity(id, entityX)

      //Force a reselection of the role
      var eds1 = edConf.editors.map((i : number) => i) 
      var eds2 = edConf.editors.filter((i : number) => i !== id)
      setEdConf ({type: ECF.editors, payload : eds2})
      setTimeout(() =>  {
        setEdConf ({type: ECF.editors, payload : eds1})
      }, 100)
    }
  }

  //Create new entity
  const handleCreate = async () => {
    var ent = await newRoleEnt (setMessage, setSession)
    if (typeof ent !== 'undefined') {
      setEdConf ({type: ECF.list, payload : [ent, ...edConf.list]})
      setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(ent.id, ent))})    
    }
  }
  
  //Commit CUD operations
  const handleCommitX = async() => {
    try {
      
      if (containsInvalid(edConf.list, setMessage)) {
        return
      }

      var saveList : RoleEntI[] = []

      //Only send updates
      for (var i=0;i<edConf.list.length;i++){
        if (edConf.list[i]._caEntityStatus === Status.changed 
          || edConf.list[i]._caEntityStatus === Status.delete) {

          var e = edConf.entities.get(edConf.list[i].id)

          var permissions : RolePermissionEntI[] = []
          for (var j=0;j<e.permissions.length;j++){
            if (e.permissions[j]._caEntityStatus === Status.changed 
              || e.permissions[j]._caEntityStatus === Status.delete) {
              permissions.push(entRemoveClientFields(e.permissions[j]))
            }
          }

          e = entRemoveClientFields(e)
          e.permissions = permissions
          saveList.push(e)
        }
      }

      var ids : number [] | undefined = await handleCommit(saveList, edConf, setEdConf, edConf.POST_URL, loadEntityRole, setMessage, setSession)
      
      //Reselect editors
      if (ids !== undefined){
        const timer = setTimeout(() =>  {
          setEdConf ({type: ECF.editors, payload : ids})
        }, 500)
          
        return () => clearTimeout(timer)             
      }

    } catch (err : any) { 
      console.log(err)      
    } 
  }
 
  //Set Changes
  const updateList = (entity : RoleEntI, field : string, value : any) => {
    updateBaseEntity(entity, field, value)

    //Load entity (required to facilitate processing)
    setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(entity.id, entity))})
    
    updateBaseList (edConf, setEdConf, entity.id, entity, setSession)
  }

  //Process checkbox clicks
  const handleCheckboxClick = (id : number | undefined, field : string) => {
    if (id !== undefined) {
      var ent : RoleEntI | null = getObjectById(Number(id), edConf.list)
      if (ent !== null) {
        type ObjectKey = keyof RoleEntI;
        const fieldX = field as ObjectKey
        updateList (ent, field, !ent[fieldX])
      }
    }
  }

  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: 'orgNr', headerName: useLabel('orgnr-s'), type: 'number', width: 50 },
    { field: 'code', headerName: useLabel('role'), width: 100, type: 'string', editable: true, },
    { field: 'descr', headerName: useLabel('desc'), width: 200, type: 'string', editable: true, },
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
    <div className='editor-container'>
      <div className='editor'>
        <div className='menu-header'>
          <TableMenu exportExcelUrl={edConf.EXCEL_URL}>
            <Button onClick={handleCommitX} langkey='save' className='table-menu-item' disabled={!session.changed}/>
            <Button onClick={handleCreate} langkey='new' className='table-menu-item' />
          </TableMenu>
        </div>
        <div className='editor-left'>
          <Editor 
            style={{ height: '80vh', minWidth : 600, maxWidth : 600 }}
            editorConfig={edConf}
            setEditorConfig={setEdConf}
            listColumns={columns}
            loadList={loadListRole}
            loadEntity={loadEntityRole}
            updateList={updateList}
            disableSelectionOnClick={true}
          >
          </Editor>
        </div>
      </div>
      {edConf.editors.map((id : number) => {
        var e = edConf.entities.get(id)
        return(
        e !== undefined ?
        <div key={id}>
            <RoleDetail 
              editorConfig={edConf}
              setEditorConfig={setEdConf}
              key={id} 
              id={id}
              entity={e}
              updateList={updateList}
              updateEntity={updateEntityPermissions}
            />
          </div>
          //ToDo
          : <div>problem</div>
      )}
      )}
    </div>
  )
}

export default RoleEditor