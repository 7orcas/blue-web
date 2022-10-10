import './role.css'
import { useContext, useMemo, useReducer, useCallback, useState } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import RoleDetail from './RoleDetail'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { loadListBase, loadNewBase, useLabel, updateBaseEntity, updateBaseList, getObjectById, handleCommit } from '../component/editor/editorUtil'
import { EditorConfig, editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { RoleEntI, RolePermissionEntI } from './role'
import { PermissionListI } from './permission'
import { GridColDef } from '@mui/x-data-grid'
import { Checkbox } from '@mui/material'
import { initEntBaseOV, initEntBase } from '../definition/interfaces'
import { EntityStatusType } from '../definition/types'

/*
  CRUD Editor for roles

  [Licence]
  Created 05.10.22
  @author John Stewart
 */

const RoleEditor = () => {
  
  const { session, setSession, setTitle, setMessage } = useContext(AppContext) as AppContextI
  setTitle('roleadmin')
  
  //State 
  var ed : EditorConfig<RoleEntI, RoleEntI> = new EditorConfig()
  ed.CONFIG_ENTITIES = useMemo(() => ['system.role.ent.EntRole','system.role.ent.EntRolePermission'], [])
  ed.CONFIG_URL = 'role/config'
  ed.LIST_URL = 'role/list'
  ed.NEW_URL = 'role/new'
  ed.POST_URL = 'role/post'
  ed.EXCEL_URL = 'role/excel'

  const [edConf, setEdConf] = useReducer(edConfRed, ed) 
  
  //Load list records
  const loadListRole = async() => {
    let list : Array<RoleEntI> = []
    var data = await loadListBase(edConf.LIST_URL, list, setMessage, setSession)
    if (typeof data !== 'undefined') {
      for (var i=0;i<data.length;i++) {
        var ent = list[i]
        ent.permissions = data[i].permissions !== 'undefined'? data[i].permissions : []
        ent.permissions.map((p) => p.entityStatus = EntityStatusType.valid)
        initEntBaseOV(ent)
      }
      setEdConf ({type: ECF.list, payload : list})
    }
  }

  //Load entity
  const loadEntityRole = async(id : number) => {
    var l : RoleEntI | null = getObjectById(id, edConf.list)
    if (l !== null) {
      setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(id, l))})  
      return l
    }
  }

  //Update list and entities
  const updateEntity = (id : number, entity : RoleEntI) => {
    setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(id, entity))})
    updateBaseList (edConf, setEdConf, id, entity, setSession)
  }

  const updateEntityPermissions = (id : number, list : PermissionListI[]) => {
    var entity : RoleEntI | null = getObjectById(id, edConf.list)
    if (entity !== null) {
      var entityX = JSON.parse(JSON.stringify(entity));
      for (var i=0;i<list.length;i++) {
        var p = list[i]
        var rp = {} as RolePermissionEntI
        initEntBase (p, rp)
        rp.permission_id = p.id
        rp.crud = p.crud
        entityX.permissions.push(rp)
      }    
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
    var l : RoleEntI = {} as RoleEntI
    var data = await loadNewBase(edConf.NEW_URL, l, setMessage, setSession)
   
    if (typeof data !== 'undefined') {
      setEdConf ({type: ECF.list, payload : [l, ...edConf.list]})
    }
  }
  
  //Commit CUD operations
  const handleCommitX = async() => {
    try {
      handleCommit(edConf, setEdConf, edConf.POST_URL, null, setMessage, setSession)
    } catch (err : any) { } 
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
              editorConfig={edConf}
              setEditorConfig={setEdConf}
              key={id} 
              id={id}
              entity={e}
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