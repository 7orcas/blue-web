import { useContext, useMemo, useReducer } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { SessionReducer } from '../system/Session'
import EditorLM from '../component/editor/EditorLM'
import OrgDetail from './OrgDetail'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { loadListBase, loadNewBase, useLabel, updateBaseList, getObjectById, handleCommit } from '../component/editor/editor'
import { EditorConfig, editorConfigReducer as edConfRed, EditorConfigType as ECT } from '../component/editor/EditorConfig'
import { OrgListI, OrgEntI, loadOrgEnt } from './org'
import { GridColDef } from '@mui/x-data-grid';
import { initEntBase } from '../definition/interfaces'

/*
  CRUD Editor for organisations

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

const OrgEditor = () => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
 
  //State 
  var ed : EditorConfig<OrgListI, OrgEntI> = new EditorConfig()
  ed.CONFIG_ENTITIES = useMemo(() => ['system.org.ent.EntOrg'], [])
  ed.CONFIG_URL = 'org/config'
  ed.LIST_URL = 'org/list'
  ed.NEW_URL = 'org/new'
  ed.POST_URL = 'org/post'
  ed.EXCEL_URL = 'org/excel'

  const [edConf, setEdConf] = useReducer(edConfRed, ed) 

  //Load list records
  const loadListOrg = async() => {
    let list : Array<OrgListI> = []
    var data = await loadListBase(edConf.LIST_URL, list, setSession, setMessage)
    if (typeof data !== 'undefined') {
      for (var i=0;i<data.length;i++) {
        var org = list[i]
        org.dvalue = data[i].dvalue
      }
      setEdConf ({type: ECT.list, payload : list})
      // setList(list)
    }
  }

  //Load entity
  const loadEntityOrg = async(id : number) => {
    var entity : OrgEntI | undefined = await loadOrgEnt(id, setSession, setMessage)
    if (typeof entity !== 'undefined') {
      setEdConf ({type: ECT.entities, payload : new Map(edConf.entities.set(id, entity))})
      return entity
    }
  }

  //Create new entity
  const handleCreate = async () => {
    var l : OrgListI = {} as OrgListI
    var data = await loadNewBase(edConf.NEW_URL, l, setSession, setMessage)
   
    if (typeof data !== 'undefined') {
      l.dvalue = data[0].dvalue
      
      var e : OrgEntI = {} as OrgEntI
      initEntBase(l, e)
      e.dvalue = l.dvalue
      e.entityStatus = l.entityStatus
      
      setEdConf ({type: ECT.entities, payload : new Map(edConf.entities.set(e.id, e))})
      setEdConf ({type: ECT.list, payload : [l, ...edConf.list]})
    }
  }

  //Update list and entities
  const updateEntity = (id : number, entity : OrgEntI) => {
    setEdConf ({type: ECT.entities, payload : new Map(edConf.entities.set(id, entity))})

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

      //Remember deleted records
      var dIds : Array<number> = []
      for (var j=0;j<edConf.list.length;j++) {
        if (edConf.list[j].changed) {
          var e = edConf.entities.get(edConf.list[j].id)
          if (e !== null && e !== undefined && e.delete) {
            dIds.push(edConf.list[j].id)
          }
        }
      }

      var data = await handleCommit(edConf, setEdConf, edConf.POST_URL, setSession, setMessage)
      if (typeof data !== 'undefined') {
        setEdConf ({type: ECT.load, payload : true})
        setSession ({type: SessionReducer.changed, payload : false})

        //Reselect newly created records (if present) and remove deleted ones
        setTimeout(() =>  {
          var ids : Array<number> = edConf.editors.slice()

          //deletes
          for (var j=0;j<dIds.length;j++) {
            const index = ids.indexOf(dIds[j]);
            if (index > -1) { 
              ids.splice(index, 1); 
            }
          }  

          //new
          for (var i=0;i<data.data.length;i++) {
            var id0 = data.data[i][0]
            var id1 = data.data[i][1]

            for (j=0;j<edConf.list.length;j++) {

              //remove temp id and add new id
              if (edConf.list[j].id === id0) {
                const index = ids.indexOf(id0);
                if (index > -1) { 
                  ids.splice(index, 1); 
                }
                ids.push(id1)
                loadEntityOrg(id1)
                break
              }
            }  
          }
          if (ids.length>0){
            edConf.editors(ids)
          }
        }, 500)
      }
    } catch (err : any) { 

    } 
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
    <div className='editor'>
      <div className='menu-header'>
        <TableMenu exportExcelUrl={edConf.EXCEL_URL}>
          <Button onClick={handleCommitX} langkey='save' className='table-menu-item' disabled={!session.changed}/>
          <Button onClick={handleCreate} langkey='new' className='table-menu-item' />
        </TableMenu>
      </div>
      <EditorLM 
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
      </EditorLM>
    </div>
  )
}

export default OrgEditor