import { useContext, useReducer } from 'react'
import AppContext, { AppContextI } from '../../../sys/system/AppContext'
import Editor from '../../../sys/component/editor/Editor'
import TableMenu from '../../../sys/component/table/TableMenu'
import ButtonNew from '../../../sys/component/utils/ButtonNew'
import ButtonSave from '../../../sys/component/utils/ButtonSave'
import { isUpdate, isDelete } from '../../../sys/system/Permission'
import { useLabel, updateBaseEntityRef, updateBaseList, getObjectById, addUpdates, handleCommit, containsInvalid } from '../../../sys/component/editor/editorUtil'
import { editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../../../sys/component/editor/EditorConfig'
import { editorConfigCountry, CountryListI, loadCountryList, newCountryList } from './country'
import { GridColDef } from '@mui/x-data-grid'
import { Checkbox } from '@mui/material'

/*
  CRUD Editor for countries

  [Licence]
  Created 06.12.22
  @author John Stewart
 */

const CountryEditor = () => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
    
  //State 
  const [edConf, setEdConf] = useReducer(edConfRed, editorConfigCountry()) 

  //Load list records
  const loadListCountry = async() => {
    var list = await loadCountryList(setMessage, setSession)
    setEdConf ({type: ECF.list, payload : list})
  }

  //Create new entity
  const handleCreate = async () => {
    var l = await newCountryList(setMessage, setSession)
    if (typeof l !== 'undefined') {
      setEdConf ({type: ECF.list, payload : [l, ...edConf.list]})
    }
  }
  
  //Commit CUD operations
  const handleCommitX = async() => {
    try {

      if (containsInvalid(edConf.list, setMessage)) {
        return
      }

      //Only send updates
      var entList : CountryListI[] = []
      addUpdates(entList, edConf)
      
      handleCommit(entList, edConf, setEdConf, edConf.POST_URL, null, setMessage, setSession)
    } catch (err : any) { } 
  }

  //Set Changes
  const updateList = (entity : CountryListI, field : string, value : any) => {
    switch (field) {
      //add fields
    }
    updateBaseEntityRef(entity, field, value)

    //Load entity (required to facilitate processing)
    setEdConf ({type: ECF.entities, payload : new Map(edConf.entities.set(entity.id, entity))})
    
    updateBaseList (edConf, setEdConf, entity.id, entity, setSession)
  }

  //Process checkbox clicks
  const handleCheckboxClick = (id : number | undefined, field : string) => {
    if (id !== undefined) {
      var ent : CountryListI | null = getObjectById(Number(id), edConf.list)
      if (ent !== null) {
        type ObjectKey = keyof CountryListI;
        const fieldX = field as ObjectKey
        updateList (ent, field, !ent[fieldX])
      }
    }
  }

  //List Columns
  var editable = isUpdate(session, session.permission)
  var deleteable = isDelete(session, session.permission)
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: 'sort', headerName: useLabel('sort'), width: 80, type: 'number', editable: editable, headerAlign : 'left'},
    { field: 'code', headerName: useLabel('code'), width: 80, type: 'string', editable: editable, },
    { field: 'descr', headerName: useLabel('country'), width: 300, type: 'string', editable: editable, },
    { field: 'dvalue', headerName: useLabel('dvalue'), width: 80, type: 'boolean', editable: editable,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.dvalue}
          onChange={() => handleCheckboxClick(params.row.id, 'dvalue')}
          disabled={!editable}
        />
      ),
    },
    { field: 'active', headerName: useLabel('active'), width: 80, type: 'boolean', editable: editable,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.active}
          onChange={() => handleCheckboxClick(params.row.id, 'active')}
          disabled={!editable}
        />
      ),
    },
    { field: 'delete', headerName: useLabel('delete'), width: 80, type: 'boolean', editable: deleteable,
      renderCell: (params) => (
        <Checkbox
          checked={params.row?.delete}
          onChange={() => handleCheckboxClick(params.row.id, 'delete')}
          disabled={!deleteable}
        />
      ),
    },
  ];

  return (
    <div className='editor'>
      <div className='menu-header'>
        <TableMenu exportExcelUrl={edConf.EXCEL_URL}>
          <ButtonSave onClick={handleCommitX} />
          <ButtonNew onClick={handleCreate} />
        </TableMenu>
      </div>
      <Editor 
        style={{ height: '80vh', minWidth : 840, maxWidth : 840 }}
        editorConfig={edConf}
        setEditorConfig={setEdConf}
        listColumns={columns}
        loadList={loadListCountry}
        updateList={updateList}
        disableSelectionOnClick={true}
        checkboxSelection={false}
      >
      </Editor>
    </div>
  )
}

export default CountryEditor