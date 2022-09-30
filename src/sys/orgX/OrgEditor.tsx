import { useState, useContext, useMemo } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { SessionReducer } from '../system/Session'
import EditorLM from '../component/editor/EditorLM'
import OrgDetail from './OrgDetail'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { loadListBase, loadNewBase, useLabel, updateBaseList, getObjectById, handleCommit } from '../component/editor/editor'
import { EditorConfig, EditorConfigReducer } from '../component/editor/EditorConfig'
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
  
  const { session, setSession, setMessage, configs, setConfigs } = useContext(AppContext) as AppContextI
  

  //State for editors
  const [list, setList] = useState<OrgListI[]>([])  //left list of all records
  const [editors, setEditors] = useState<Array<number>>([])  //detailed editors (contains entity id)
  const [entities, setEntities] = useState<Map<number,OrgEntI>>(new Map()) //loaded full entities
  const [load, setLoad] = useState(true) //flag to load editor (always initialise true)

  //Editor Config Holds State
  var ed = new EditorConfig<OrgListI, OrgEntI>()
  ed.CONFIG_ENTITIES = useMemo(() => ['system.org.ent.EntOrg'], [])
  ed.CONFIG_URL = 'org/config'
  ed.LIST_URL = 'org/list'
  ed.NEW_URL = 'org/new'
  ed.POST_URL = 'org/post'
  ed.EXCEL_URL = 'org/excel'

  const [editorConfig, setEditorConfig] = useState(ed) 
  


  //Load list records
  const loadListOrg = async() => {
    let list : Array<OrgListI> = []
    var data = await loadListBase(editorConfig.LIST_URL, list, setSession, setMessage)
    if (typeof data !== 'undefined') {
      for (var i=0;i<data.length;i++) {
        var org = list[i]
        org.dvalue = data[i].dvalue
      }
      setList(list)
    }
  }

  //Load entity
  const loadEntityOrg = async(id : number) => {
    var entity : OrgEntI | undefined = await loadOrgEnt(id, setSession, setMessage)
    if (typeof entity !== 'undefined') {
      setEntities(new Map(entities.set(id, entity)))
      return entity
    }
  }

  //Create new entity
  const handleCreate = async () => {
    var l : OrgListI = {} as OrgListI
    var data = await loadNewBase(editorConfig.NEW_URL, l, setSession, setMessage)
   
    if (typeof data !== 'undefined') {
      l.dvalue = data[0].dvalue
      
      var e : OrgEntI = {} as OrgEntI
      initEntBase(l, e)
      e.dvalue = l.dvalue
      e.entityStatus = l.entityStatus
      
      setEntities(new Map(entities.set(e.id, e)))
      setList([l, ...list])
      return list
    }
  }

  //Update list and entities
  const updateEntity = (id : number, entity : OrgEntI) => {
    setEntities(new Map(entities.set(id, entity)))

    //Update non base list fields first 
    var l = getObjectById(id, list)
    if (l !== null) {
      l.dvalue = entity.dvalue
    }

    updateBaseList (id, entity, list, setList, setSession)
  }
  
  //Commit CUD operations
  const handleCommitX = async() => {
    try {

      //Remember deleted records
      var dIds : Array<number> = []
      for (var j=0;j<list.length;j++) {
        if (list[j].changed) {
          var e = entities.get(list[j].id)
          if (e !== null && e !== undefined && e.delete) {
            dIds.push(list[j].id)
          }
        }
      }

      var data = await handleCommit(editorConfig.POST_URL, list, setList, entities, setSession, setMessage)
      if (typeof data !== 'undefined') {
        setLoad(true)
        setSession ({type: SessionReducer.changed, payload : false})

        //Reselect newly created records (if present) and remove deleted ones
        setTimeout(() =>  {
          var ids : Array<number> = editors.slice()

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

            for (j=0;j<list.length;j++) {

              //remove temp id and add new id
              if (list[j].id === id0) {
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
            setEditors(ids)
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
        <TableMenu exportExcelUrl={editorConfig.EXCEL_URL}>
          <Button onClick={handleCommitX} langkey='save' className='table-menu-item' disabled={!session.changed}/>
          <Button onClick={handleCreate} langkey='new' className='table-menu-item' />
        </TableMenu>
      </div>
      <EditorLM 
        configEntities={editorConfig.CONFIG_ENTITIES}
        configUrl={CONFIG_URL}
        listColumns={columns}
        load={load}
        setLoad={setLoad}
        loadList={loadListOrg}
        loadEntity={loadEntityOrg}
        list={list}
        setList={setList}
        entities={entities}
        setEntities={setEntities}
        editors={editors}
        setEditors={setEditors}
        selectionModel={editors}
      >
        {editors.map((id) => {
          var e = entities.get(id)
          return(
          e !== undefined ?
            <div key={id} className='editor-right'>
              <OrgDetail 
                key={id} 
                id={id}
                entity={e}
                editorConfig={editorConfig} 
                setEditorConfig={setEditorConfig}
                updateEntity={updateEntity}
                editors={editors}
                setEditors={setEditors}
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