import { useContext, useMemo, useReducer, useEffect } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import OrgDetail from './OrgDetail'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { OrgListI, OrgEntI, loadOrgList, loadOrgEnt, newOrgList, newOrgEnt } from './org'
import { useLabel, updateBaseList, getObjectById, handleCommit } from '../component/editor/editorUtil'
import { EditorConfig, editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { GridColDef } from '@mui/x-data-grid';
import { initEntBase, entRemoveClientFields } from '../definition/interfaces'

/*
  CRUD Editor for organisations

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

const OrgEditor = () => {
  
  const { session, setSession, setTitle, setMessage } = useContext(AppContext) as AppContextI
  
  //State 
  var ed : EditorConfig<OrgListI, OrgEntI> = new EditorConfig()
  ed.CONFIG_ENTITIES = useMemo(() => ['system.org.ent.EntOrg'], [])
  ed.CONFIG_URL = 'org/config'
  ed.POST_URL = 'org/post'
  ed.EXCEL_URL = 'org/excel'

  const [edConf, setEdConf] = useReducer(edConfRed, ed) 

  useEffect(() => {
    setTitle('orgadmin')
  },[setTitle])


  //Load list records
  const loadListOrg = async() => {
    var list = await loadOrgList(setMessage, setSession)
    setEdConf ({type: ECF.list, payload : list})
  }

  //Load entity
  const loadEntityOrg = async(id : number) => {
    var entity : OrgEntI | undefined = await loadOrgEnt(id, setMessage, setSession)
    if (typeof entity !== 'undefined') {
      setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(id, entity))})
      return entity
    }
  }

  //Create new entity
  const handleCreate = async () => {
    var l = await newOrgList(setMessage, setSession)
    if (typeof l !== 'undefined') {
      var e : OrgEntI = newOrgEnt(l)
      setEdConf ({type: ECF.list, payload : [l, ...edConf.list]})
      setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(e.id, e))})
    }
  }

  //Update list and entities
  const updateEntity = (id : number, entity : OrgEntI) => {
    setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(id, entity))})

    //Update non base list fields first 
    var l : OrgListI | null = getObjectById(id, edConf.list)
    if (l !== null) {
      l.dvalue = entity.dvalue
    }

    updateBaseList (edConf, setEdConf, id, entity, setSession)
  }
  
  //Commit CUD operations
  const handleCommitX = async() => {
    try {

      //Only send updates
      var entList : OrgEntI[] = []
      for (var i=0;i<edConf.list.length;i++){
        if (edConf.list[i]._caChanged === true) {
          var e = edConf.entities.get(edConf.list[i].id)
          if (e !== null && e !== undefined) {
            e = entRemoveClientFields(e)
            entList.push(e)
          }
        }
      }

      handleCommit(entList, edConf, setEdConf, edConf.POST_URL, loadEntityOrg, setMessage, setSession)
    } catch (err : any) { } 
  }

  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50 },
    { field: 'orgNr', headerName: useLabel('orgnr-s'), type: 'number', width: 60 },
    { field: 'code', headerName: useLabel('code'), width: 200 },
    { field: 'dvalue', headerName: useLabel('dvalue'), width: 60, type: 'boolean' },
    { field: 'active', headerName: useLabel('active'), width: 60, type: 'boolean' },
    { field: 'changed', headerName: useLabel('changed'), width: 60, type: 'boolean' },
  ];

  return (
    <div>
      <div className='menu-header'>
        <TableMenu exportExcelUrl={edConf.EXCEL_URL}>
          <Button onClick={handleCommitX} langkey='save' className='table-menu-item' disabled={!session.changed}/>
          <Button onClick={handleCreate} langkey='new' className='table-menu-item' />
        </TableMenu>
      </div>
      <Editor 
        style={{ height: '80vh', minWidth : 500, maxWidth : 500 }}
        editorConfig={edConf}
        setEditorConfig={setEdConf}
        listColumns={columns}
        loadList={loadListOrg}
        loadEntity={loadEntityOrg}
      >
        {edConf.editors.map((id : number) => {
          var e = edConf.entities.get(id)
          return(
          e !== undefined ?
            <div key={id} className='editor-right'>
              <OrgDetail 
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

export default OrgEditor