import { useContext, useMemo, useReducer, useCallback } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import RoleDetail from './RoleDetail'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { loadListBase, loadNewBase, useLabel, updateBaseEntity, updateBaseList, getObjectById, handleCommit } from '../component/editor/editorUtil'
import { EditorConfig, editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { RoleEntI } from './role'
import { GridColDef } from '@mui/x-data-grid'
import { Checkbox } from '@mui/material'
import { initEntBaseOV } from '../definition/interfaces'
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
    var data = await loadListBase(edConf.LIST_URL, list, setSession, setMessage)
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

    //Update non base list fields first 
    // var l : OrgListI | null = getObjectById(id, edConf.list)
    // if (l !== null) {
    //   l.dvalue = entity.dvalue
    // }

    updateBaseList (edConf, setEdConf, id, entity, setSession)
  }

  //Create new entity
  const handleCreate = async () => {
    var l : RoleEntI = {} as RoleEntI
    var data = await loadNewBase(edConf.NEW_URL, l, setSession, setMessage)
   
    if (typeof data !== 'undefined') {
      setEdConf ({type: ECF.list, payload : [l, ...edConf.list]})
    }
  }
  
  //Commit CUD operations
  const handleCommitX = async() => {
    try {
      handleCommit(edConf, setEdConf, edConf.POST_URL, null, setSession, setMessage)
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
    <div>
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
      <div className='menu-header'>
        <TableMenu exportExcelUrl={edConf.EXCEL_URL}>
          <Button onClick={handleCommitX} langkey='save' className='table-menu-item' disabled={!session.changed}/>
          <Button onClick={handleCreate} langkey='new' className='table-menu-item' />
        </TableMenu>
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
                updateEntity={updateEntity}
              />
            </div>
            : <div>problem</div>
        )}
        )}
      </Editor>
    </div>
  )
}

export default RoleEditor