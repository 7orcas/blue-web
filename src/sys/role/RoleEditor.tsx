import { useContext, useMemo, useReducer, useCallback } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { loadListBase, loadNewBase, useLabel, updateBaseEntity, updateBaseList, getObjectById, handleCommit } from '../component/editor/editorUtil'
import { EditorConfig, editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { RoleListI } from './role'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Checkbox } from '@mui/material'
import { initEntBaseOV } from '../definition/interfaces'

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
  var ed : EditorConfig<RoleListI, RoleListI> = new EditorConfig()
  ed.CONFIG_ENTITIES = useMemo(() => ['system.role.ent.EntRole'], [])
  ed.CONFIG_URL = 'role/config'
  ed.LIST_URL = 'role/list'
  ed.NEW_URL = 'role/new'
  ed.POST_URL = 'role/post'
  ed.EXCEL_URL = 'role/excel'

  const [edConf, setEdConf] = useReducer(edConfRed, ed) 

  //Load list records
  const loadListRole = async() => {
    let list : Array<RoleListI> = []
    var data = await loadListBase(edConf.LIST_URL, list, setSession, setMessage)
    if (typeof data !== 'undefined') {
      for (var i=0;i<data.length;i++) {
        var ent = list[i]
        initEntBaseOV(ent)
      }
      setEdConf ({type: ECF.list, payload : list})
    }
  }

  //Create new entity
  const handleCreate = async () => {
    var l : RoleListI = {} as RoleListI
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
  const updateList = (entity : RoleListI, field : string, value : any) => {
    updateBaseEntity(entity, field, value)

    //Load entity (required to facilitate processing)
    setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(entity.id, entity))})
    
    updateBaseList (edConf, setEdConf, entity.id, entity, setSession)
  }

  //Process checkbox clicks
  const handleCheckboxClick = (id : number | undefined, field : string) => {
    if (id !== undefined) {
      var ent : RoleListI | null = getObjectById(Number(id), edConf.list)
      if (ent !== null) {
        type ObjectKey = keyof RoleListI;
        const fieldX = field as ObjectKey
        updateList (ent, field, !ent[fieldX])
      }
    }
  }


  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: 'orgNr', headerName: useLabel('orgnr-s'), type: 'number', width: 80 },
    { field: 'code', headerName: useLabel('code'), width: 150, type: 'string', editable: true, },
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
    <div className='editor'>
      <div className='menu-header'>
        <TableMenu exportExcelUrl={edConf.EXCEL_URL}>
          <Button onClick={handleCommitX} langkey='save' className='table-menu-item' disabled={!session.changed}/>
          <Button onClick={handleCreate} langkey='new' className='table-menu-item' />
        </TableMenu>
      </div>
      <Editor 
        style={{ height: '80vh', minWidth : 700, maxWidth : 700 }}
        editorConfig={edConf}
        setEditorConfig={setEdConf}
        listColumns={columns}
        loadList={loadListRole}
        updateList={updateList}
        disableSelectionOnClick={true}
      >
      </Editor>
    </div>
  )
}

export default RoleEditor