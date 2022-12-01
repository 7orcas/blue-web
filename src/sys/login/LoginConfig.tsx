import { useContext, useReducer } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import Editor from '../component/editor/Editor'
import { EditorConfig, editorConfigReducer as edConfRed, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { BaseEntI } from '../definition/interfaces'
import { EntityStatusType as Status } from '../definition/types'
import { GridColDef } from '@mui/x-data-grid';
import TextField from '../component/utils/TextField'
import TableMenu from '../component/table/TableMenu'

/*
  Show current login configuration

  [Licence]
  Created 24.11.22
  @author John Stewart
*/
const editorConfig = () : EditorConfig<BaseEntI, BaseEntI> => {
  var ed : EditorConfig<BaseEntI, BaseEntI> = new EditorConfig()
  ed.EDITOR_TITLE = 'loginconf'
  return ed
}

const LoginConfig = () => {
        
  const { session, setTitle } = useContext(AppContext) as AppContextI

  //State 
  const [edConf, setEdConf] = useReducer(edConfRed, editorConfig()) 
  

  //Load list records
  const loadList = async() => {
    var list : Array<BaseEntI> = []
    var p = session.params
    var id = 1

    list.push(load(id++, 'username', session.username))
    list.push(load(id++, 'lang', session.lang))
    list.push(load(id++, 'orgNr', '' + session.orgNr))
    list.push(load(id++, 'adminLoggedIn', '' + p.adminLoggedIn))
    list.push(load(id++, 'devAdmin', '' + session.devAdmin))
    list.push(load(id++, 'clientNr', '' + p.clientNr))
    list.push(load(id++, 'baseUrl', p.baseUrl))
    list.push(load(id++, 'uploadUrl', p.uploadUrl))
    list.push(load(id++, 'init', p.init))
    list.push(load(id++, 'sid', p.sid))

    setEdConf ({type: ECF.list, payload : list})
  }

  const load = (id : number, code : string, descr : string) => {
    var e : BaseEntI = {} as BaseEntI
    e.id = id
    e.code = code
    e.descr = descr
    e._caEntityStatus = Status.valid
    return e
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', type: 'number', width: 50, hide: true },
    { field: 'code', headerName: 'config', width: 200 },
    { field: 'descr', headerName: 'value', width: 490 },
  ]

  return (
    <div className='editor-container'>
      <div className='editor'>
        <Editor 
          style={{ height: '80vh', minWidth : 700, maxWidth : 700 }}
          editorConfig={edConf}
          setEditorConfig={setEdConf}
          listColumns={columns}
          loadList={loadList}
          disableSelectionOnClick={true}
          checkboxSelection={false}
          >
        </Editor>
      </div>
    </div>
  )
}

export default LoginConfig
