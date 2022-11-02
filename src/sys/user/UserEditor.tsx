import './user.css'
import { useContext, useReducer } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { editorConfigUser, UserEntI, UserListI, loadUserList, loadUserEntity, newUserEnt } from './user'
import Editor from '../component/editor/Editor'
import UserDetail from './UserDetail'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { useLabel, updateBaseEntity, updateBaseList, getObjectById, handleCommit, containsInvalid } from '../component/editor/editorUtil'
import { editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { GridColDef } from '@mui/x-data-grid'
import { Checkbox } from '@mui/material'
import { entRemoveClientFields } from '../definition/interfaces'
import { EntityStatusType as Status } from '../definition/types'


/*
  Editor for users

  [Licence]
  Created 02.11.22
  @author John Stewart
 */

const UserEditor = () => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
  
  //State 
  const [edConf, setEdConf] = useReducer(edConfRed, editorConfigUser()) 
 
  //Load list records
  const loadListUser = async() => {
    var list = await loadUserList(setMessage, setSession)
    if (typeof list !== 'undefined') {
      setEdConf ({type: ECF.list, payload : list})
    }
  }

  //Load full entity 
  const loadEntityUser = async (id : number) => {
    if (edConf.entities.has(id)) {
      return edConf.entities.get(id)
    }
    var ent = await loadUserEntity(id, setMessage, setSession)
    if (typeof ent !== 'undefined') {
      setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(id, ent))})  
      return ent
    }
  }

  //Update list and entities
  const updateEntity = (id : number, entity : UserEntI) => {
    setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(id, entity))})
    var list : UserEntI | null = getObjectById(id, edConf.list)
    if (list !== null) {
      // list.permissions = entity.permissions
    }
    updateBaseList (edConf, setEdConf, id, entity, setSession)
  }

  //Update role dialog selections
  // const updateEntityPermissions = (id : number, list : PermissionListI[]) => {
  //   var entity : UserEntI | null = getObjectById(id, edConf.list)
  //   var tempId = edConf.tempId;

  //   if (entity !== null) {

  //     entity.permissions.forEach((p : UserPermissionEntI) => p._caParent = null)

  //     var entityX = JSON.parse(JSON.stringify(entity));
  //     for (var i=0;i<list.length;i++) {
  //       var found = false
        
  //       for (var j=0;j<entity.permissions.length;j++) {
  //         if (entity.permissions[j].permissionId === list[i].id) found = true
  //       }

  //       if (!found) {
  //         var rp = newUserPermissionEnt(list[i], tempId, entity)
  //         rp._caEntityStatus = Status.changed
  //         entityX.permissions.push(rp)
  //         tempId -= 1
  //       }
  //     }
      
  //     entityX.permissions.forEach((p : UserPermissionEntI) => p._caParent = entityX)

  //     setEdConf ({type: ECF.tempId, payload : tempId})
  //     updateEntity(id, entityX)

  //     //Force a reselection of the role
  //     var eds1 = edConf.editors.map((i : number) => i) 
  //     var eds2 = edConf.editors.filter((i : number) => i !== id)
  //     setEdConf ({type: ECF.editors, payload : eds2})
  //     setTimeout(() =>  {
  //       setEdConf ({type: ECF.editors, payload : eds1})
  //     }, 100)
  //   }
  // }

  //Create new entity
  const handleCreate = async () => {
    var ent = await newUserEnt (setMessage, setSession)
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
      
      //Only send updates
      var saveList : UserEntI[] = []
      for (var i=0;i<edConf.list.length;i++){
        var l = edConf.list[i]

        if (l._caEntityStatus === Status.changed 
          || l._caEntityStatus === Status.delete) {

          var e = edConf.entities.get(l.id)
          e = entRemoveClientFields(e)
          // e.permissions = permissions
          saveList.push(e)
        }
      }

      var ids : number [] | undefined = await handleCommit(saveList, edConf, setEdConf, edConf.POST_URL, loadEntityUser, setMessage, setSession)
      
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
 
  //Set Changes (in both list and editor entities)
  const updateList = async (lst : UserListI, field : string, value : any) => {
    var ent = await loadEntityUser(lst.id)
    if (typeof ent !== 'undefined') {
      updateBaseEntity(lst, field, value)
      updateBaseEntity(ent, field, value)
      switch (field) {
        case 'attempts': 
          lst.attempts = value
          ent.attempts = value
          break
      }
      updateBaseList (edConf, setEdConf, ent.id, ent, setSession)
    }
  }

  //Process checkbox clicks
  const handleCheckboxClick = (id : number | undefined, field : string) => {
    if (id !== undefined) {
      var lst : UserListI | null = getObjectById(Number(id), edConf.list)
      if (lst !== null) {
        type ObjectKey = keyof UserListI;
        const fieldX = field as ObjectKey
        updateList (lst, field, !lst[fieldX])
      }
    }
  }

  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: 'code', headerName: useLabel('user'), width: 300, type: 'string' },
    { field: 'attempts', headerName: useLabel('attempts'), type: 'number', width: 70, editable: true, },
    { field: 'active', headerName: useLabel('active'), width: 80, type: 'boolean', editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.active}
          onChange={() => handleCheckboxClick(params.row.id, 'active')}
        />
      ),
    },
    { field: 'delete', headerName: useLabel('delete'), width: 80, type: 'boolean', editable: false,
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
            loadList={loadListUser}
            loadEntity={loadEntityUser}
            updateList={updateList}
            disableSelectionOnClick={true}
          >
          </Editor>
        </div>
      </div>
      {/* {edConf.editors.map((id : number) => {
        var e = edConf.entities.get(id)
        return(
        e !== undefined ?
        <div key={id}>
            <UserDetail 
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
      )} */}
    </div>
  )
}

export default UserEditor