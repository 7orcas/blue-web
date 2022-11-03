import { useContext, useReducer } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import OrgDetail from './OrgDetail'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { Checkbox } from '@mui/material'
import { editorConfig, OrgListI, OrgEntI, loadOrgList, loadOrgEnt, newOrgList, newOrgEnt } from './org'
import { useLabel, updateBaseEntity, updateBaseList, getObjectById, handleCommit, containsInvalid } from '../component/editor/editorUtil'
import { editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { GridColDef } from '@mui/x-data-grid';
import { entRemoveClientFields } from '../definition/interfaces'
import { EntityStatusType as Status } from "../definition/types"

/*
  CRUD Editor for organisations
  - Don't allow fields to be updated in both list and editors - it can only be in one place

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

const OrgEditor = () => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
  
  //State 
  const [edConf, setEdConf] = useReducer(edConfRed, editorConfig()) 

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

  //Update entity (assumes the list object is up-to-date, ie no shared entry fields between list and editor)
  const updateEntity = (entity : OrgEntI) => {
    setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(entity.id, entity))})
    //Update list fields
    updateBaseList (edConf, setEdConf, entity.id, entity, setSession)
  }
  
  //Process checkbox clicks
  const handleCheckboxClick = (id : number | undefined, field : string) => {
    if (id !== undefined) {

      //Load entity (if required)
      if (!edConf.entities.has(id)) {
        loadEntityOrg(id)
      }
      
      //Update list object
      var list : OrgListI | null = getObjectById(Number(id), edConf.list)
      if (list !== null) {
        switch (field) {
          case 'dvalue': list.dvalue = !list.dvalue; break
        }
        type ObjectKey = keyof OrgListI;
        const fieldX = field as ObjectKey
        updateBaseEntity(list, field, !list[fieldX])
        updateBaseList (edConf, setEdConf, list.id, list, setSession)
        // updateList (list, field, !list[fieldX])
      }
    }
  }

  //Commit CUD operations
  const handleCommitX = async() => {
    try {

      if (containsInvalid(edConf.list, setMessage)) {
        return
      }

      //Only send updates
      var entList : OrgEntI[] = []
      for (var i=0;i<edConf.list.length;i++){
        var list : OrgListI = edConf.list[i]

        if (list._caEntityStatus === Status.changed 
          || list._caEntityStatus === Status.delete) {
          var e = edConf.entities.get(list.id)
          if (e !== null && e !== undefined) {
            e = entRemoveClientFields(e)

            //Update entity from list field changes
            e.dvalue = list.dvalue
            e.active = list.active
            e.delete = list.delete

            entList.push(e)
          }
        }
      }

      var ids : number [] | undefined = await handleCommit(entList, edConf, setEdConf, edConf.POST_URL, loadEntityOrg, setMessage, setSession)

      //Reselect editors and reload entitites
      if (ids !== undefined){
        const timer = setTimeout(() =>  {
          setEdConf ({type: ECF.editors, payload : ids})
          ids?.forEach((id : number) => loadEntityOrg(id))
        }, 500)
          
        return () => clearTimeout(timer)             
      }

    } catch (err : any) { } 
  }

  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: 'orgNr', headerName: useLabel('orgnr-s'), type: 'number', width: 60 },
    { field: 'code', headerName: useLabel('code'), width: 200 },
    { field: 'dvalue', headerName: useLabel('dvalue'), width: 60, type: 'boolean', editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.dvalue}
          onChange={() => handleCheckboxClick(params.row.id, 'dvalue')}
        />
      ),
    },
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
            style={{ height: '80vh', minWidth : 550, maxWidth : 550 }}
            editorConfig={edConf}
            setEditorConfig={setEdConf}
            listColumns={columns}
            loadList={loadListOrg}
            loadEntity={loadEntityOrg}
            disableSelectionOnClick={true}
            >
          </Editor>
        </div>
      </div>
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
          : <div>loading... </div>
      )}
      )}
    </div>
  )
}

export default OrgEditor