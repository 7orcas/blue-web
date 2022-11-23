import { useContext, useReducer } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import TableMenu from '../component/table/TableMenu'
import ButtonNew from '../component/utils/ButtonNew'
import ButtonSave from '../component/utils/ButtonSave'
import { isUpdate, isDelete } from '../system/Permission'
import { useLabel, updateBaseEntity, updateBaseList, getObjectById, handleCommit, containsInvalid } from '../component/editor/editorUtil'
import { editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { editorConfigLogins, loadLoginList } from './logins'
import { GridColDef } from '@mui/x-data-grid'

/*
  Editor for logins (from server cache)

  [Licence]
  Created 23.11.22
  @author John Stewart
 */

const CacheEditor = () => {
  
  const { setSession, setMessage } = useContext(AppContext) as AppContextI
    
  //State 
  const [edConf, setEdConf] = useReducer(edConfRed, editorConfigLogins()) 

  //Load list records
  const loadListLogin = async() => {
    var list = await loadLoginList(setMessage, setSession)
    setEdConf ({type: ECF.list, payload : list})
  }

  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('userid'), type: 'number', width: 50 },
    { field: 'code', headerName: useLabel('username'), width: 150, type: 'string' },
    { field: 'clientNr', headerName: useLabel('clientnr'), type: 'number', width: 80 },
    { field: 'descr', headerName: useLabel('sessionid'), width: 300, type: 'string' },
  ];

  return (
    <div className='editor'>
      <Editor 
        style={{ height: '80vh', minWidth : 840, maxWidth : 840 }}
        editorConfig={edConf}
        setEditorConfig={setEdConf}
        listColumns={columns}
        loadList={loadListLogin}
        disableSelectionOnClick={true}
        checkboxSelection={false}
      >
      </Editor>
    </div>
  )
}

export default CacheEditor