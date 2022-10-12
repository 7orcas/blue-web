import './role.css'
import { useContext, useMemo, useReducer, useEffect, useRef } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { RoleEntI, PermissionListI, loadRoleList, newRoleEnt, newRolePermissionEnt, appendPermissions, RolePermissionEntI } from './role'
import Editor from '../component/editor/Editor'
import RoleDetail from './RoleDetail'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { useLabel, updateBaseEntity, updateBaseList, getObjectById, handleCommit } from '../component/editor/editorUtil'
import { EditorConfig, editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { GridColDef } from '@mui/x-data-grid'
import { Checkbox } from '@mui/material'
import { initEntBaseOV, entRemoveClientFields } from '../definition/interfaces'
import { EntityStatusType } from '../definition/types'
import useTimeout from '../component/editor/useTimeout'

/*
  CRUD Editor for roles

  [Licence]
  Created 05.10.22
  @author John Stewart
 */

const RoleEditor = () => {
  
  const { session, setSession, setTitle, setMessage } = useContext(AppContext) as AppContextI
  
  //State 
  var ed : EditorConfig<RoleEntI, RoleEntI> = new EditorConfig()
  ed.CONFIG_ENTITIES = useMemo(() => ['system.role.ent.EntRole','system.role.ent.EntRolePermission'], [])
  ed.CONFIG_URL = 'role/config'
  ed.POST_URL = 'role/post'
  ed.EXCEL_URL = 'role/excel'

  const [edConf, setEdConf] = useReducer(edConfRed, ed) 
  
  
  useEffect(() => {
    setTitle('roleadmin')
  },[setTitle])
  
  useEffect(() => {
    if (edConf.reload.length === 0) return
console.log('useEffect1 ' + edConf.reload.length)
    const timer =setTimeout(() =>  {
console.log('useEffect2 ' + edConf.reload.length)

      // for (var j=0;j<edConf.reload.length;j++) {
      //   loadEntityRole(edConf.reload[j])
      // }
      setEdConf ({type: ECF.editors, payload : edConf.reload})
    }, 2000)

    setEdConf ({type: ECF.reload, payload : []})
    // return () => clearTimeout(timer)
  },[edConf.reload])
  

  //Load list records
  const loadListRole = async() => {
    var list = await loadRoleList(setMessage, setSession)
    if (typeof list !== 'undefined') {
      setEdConf ({type: ECF.list, payload : list})

      for (var i=0;i<list.length;i++) {
        setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(list[i].id, list[i]))})    
      }


// console.log('loadListRole ' + list[1].id + ' ' + list[1].permissions[0].delete)
    }
  }

  //Load entity (from list object)
  const loadEntityRole = (id : number) => {
//     var l : RoleEntI | null = getObjectById(id, edConf.list)
// console.log('loadEntityRole ' + l?.id + ' ' +  l?.permissions[0].delete)
//     if (l !== null) {
//       setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(id, l))})  
//       return l
//     }
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

  const updateEntityPermissions = (id : number, list : PermissionListI[]) => {
    var entity : RoleEntI | null = getObjectById(id, edConf.list)
    var tempId = edConf.tempId;

    if (entity !== null) {

      for (var i=0;i<entity.permissions.length;i++) {
        entity.permissions[i]._caParent = null
      }

      var entityX = JSON.parse(JSON.stringify(entity));
      for (i=0;i<list.length;i++) {
        var rp = newRolePermissionEnt(list[i], tempId, entity)
        entityX.permissions.push(rp)
        tempId -= 1
      }
      
      for (i=0;i<entityX.permissions.length;i++) {
        entityX.permissions[i]._caParent = entityX
      }    

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

      //Only send updates
      var entList : RoleEntI[] = []
      for (var i=0;i<edConf.list.length;i++){
        if (edConf.list[i]._caChanged === true) {
console.log('change 1')
          var e = edConf.entities.get(edConf.list[i].id)

          var permissions : RolePermissionEntI[] = []
          for (var j=0;j<e.permissions.length;j++){
            if (e.permissions[j]._caChanged === true) {
              permissions.push(entRemoveClientFields(e.permissions[j]))
            }
          }

          if (e !== null && e !== undefined) {
            e = entRemoveClientFields(e)
            e.permissions = permissions
console.log('change 2 id=' + e.id + ' permissions.length=' + permissions.length)
            entList.push(e)
          }
        }
      }

      var ids : number [] | undefined = await handleCommit(entList, edConf, setEdConf, edConf.POST_URL, loadEntityRole, setMessage, setSession)
      if (ids !== undefined){
console.log('change 3 ' + ids.length)
      setEdConf ({type: ECF.reload, payload : ids})
console.log('done')
      }
      // useTimeout(() => {

      // }, 5000)

    } catch (err : any) { 
console.log(err)      
    } 
  }

  useTimeout(() => {

  }, 5000)

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
    { field: '_caChanged', headerName: useLabel('changed'), type: 'number', width: 50 },
    { field: 'orgNr', headerName: useLabel('orgnr-s'), type: 'number', width: 50, hide: true },
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
      <div >
        <div className='menu-header'>
          <TableMenu exportExcelUrl={edConf.EXCEL_URL}>
            <Button onClick={handleCommitX} langkey='save' className='table-menu-item' disabled={!session.changed}/>
            <Button onClick={handleCreate} langkey='new' className='table-menu-item' />
          </TableMenu>
        </div>
        <Editor 
          style={{ height: '80vh', minWidth : 550, maxWidth : 550 }}
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
      {edConf.editors.map((id : number) => {
        var e = edConf.entities.get(id)
        return(
        e !== undefined ?
        <div key={id}>
            <RoleDetail 
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