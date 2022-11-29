import { useContext, useReducer } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import { useLabel, formatTs } from '../component/editor/editorUtil'
import { editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { editorConfigLogins, loadLoginList } from './logins'
import { GridColDef } from '@mui/x-data-grid'
import LoginDetail from './LoginDetail'

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

  //Reload page
  const refreshPage = () => {
    // navigate(0)
    loadListLogin()
  }

  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: 'userId', headerName: useLabel('userid'), type: 'number', width: 70 },
    { field: 'code', headerName: useLabel('username'), width: 200, type: 'string' },
    { field: 'clientNr', headerName: useLabel('clientnr'), type: 'number', width: 70 },
    { field: 'descr', headerName: useLabel('sessionid'), width: 350, type: 'string' },
    { field: 'created', headerName: useLabel('login'), width: 170, type: 'string',
      renderCell: (params) => (formatTs(params.row?.created))
    },
    { field: 'updated', headerName: useLabel('lastact'), width: 170, type: 'string',
      renderCell: (params) => (formatTs(params.row?.updated)) 
    },
  ];

  return (
    <div className='editor-container'>
      <div className='editor'>
        <div className='menu-header'>
          <TableMenu>
            <Button onClick={refreshPage} langkey='refresh' className='table-menu-item' />
          </TableMenu>
        </div>
        <Editor 
          style={{ height: '80vh', minWidth : 1100, maxWidth : 1100 }}
          editorConfig={edConf}
          setEditorConfig={setEdConf}
          listColumns={columns}
          loadList={loadListLogin}
          disableSelectionOnClick={true}
          checkboxSelection={false}
        >
        </Editor>
      </div>
      <LoginDetail />
    </div>
  )
}

export default CacheEditor