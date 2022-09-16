import { useState, useContext, useCallback, useEffect } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { SessionReducer } from '../system/Session'
import loadLabels, { LabelI } from './loadLabels'
import useLabel from './useLabel'
import { Menu, MenuButton } from '@szhsin/react-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import MenuItemFactory, { MenuItem } from '../../sys/menu/MenuItemFactory'
import MenuX from "../../sys/menu/MenuX"
import ReactDataGrid from '@inovua/reactdatagrid-community'
import { ThemeType } from '../system/Session'
import '@inovua/reactdatagrid-community/index.css'
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import { TypeEditInfo } from '@inovua/reactdatagrid-community/types'
import Button from '../component/utils/Button'
import download from '../component/utils/download'
import UploadDialog from '../component/dialog/UploadDialog'

/*
  List, export and update language labels

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

const LabelsEditor = () => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
  const [dataSource, setDataSource] = useState<LabelI[]>([])
  const [openUpload, setOpenUpload] = useState (false)
  
  useEffect(() => {
    const loadLabelsX = async() => {
      var l : LabelI[] | undefined = await loadLabels('All', setSession, setMessage)
      if (typeof l !== 'undefined') {
        setDataSource(l)
      }
    }
    loadLabelsX()
  },[setSession, setMessage])

  const columns = [
    { name: 'id', header : 'ID', type: 'number', defaultWidth: 60, editable: false },
    { name: 'org', header : 'Org', type: 'number', defaultWidth: 60, editable: false },
    { name: 'key', header : 'Label Key', defaultFlex: 0, xdefaultLocked: 'start', editable: false },
    { name: 'label', header : 'Label: ' + session.lang, defaultFlex: 1, xdefaultLocked: 'end' },
  ];
  const columnOrder = ['id', 'org', 'key', 'label']
  
  const defaultFilterValue = [
    { name: 'key', type: 'string', operator: 'contains', value: '' },
    { name: 'label', type: 'string', operator: 'contains', value: '' }
  ];

  const onEditComplete = useCallback(( editInfo : TypeEditInfo )  => {
    const data : LabelI[] = [...dataSource];
    const id = parseInt(editInfo.rowId)
    for (let i=0;i<data.length;i++){
      if (data[i].id === id){
        data[i].label = editInfo.value
        break;
      }
    }
    setDataSource (data)
  }, [dataSource])

  const showInClient = () => {
    setSession ({type: SessionReducer.labels, payload: dataSource})
  }

  //Table Menu
  const f = new MenuItemFactory ()
  var tableMenu = new MenuItem(9999)
  
  var downloadX = f.action(useLabel('expExcel'), () => download('lang/pack/excel'))
  tableMenu.menu.push(downloadX)
  var uploadX = f.action(useLabel('fileup-label'), () => setOpenUpload(!openUpload))
  tableMenu.menu.push(uploadX)

  const setSelection = (item : MenuItem) => {
   item.action()
  }

  return (
    <div className='table-grid'>
      <div className='table-menu'>
        <Button onClick={showInClient} langkey='showchange'/>
        <div className='table-menu-item-dropdown menu-item button'>
          <Menu 
            menuButton={<MenuButton><FontAwesomeIcon icon={faBars} /></MenuButton>} transition
            className='table-menu-item'
            >
            {tableMenu.menu.map(i => (
              <MenuX key={i.key} item={i} setSelection={setSelection}/>
            ))}
          </Menu>
        </div>
      </div>
      <ReactDataGrid
        idProperty='id'
        style={{height: '80vh'}}
        theme={session.theme === ThemeType.dark? 'default-dark' : 'default-light'}
        defaultFilterValue={defaultFilterValue}
        columns={columns}
        columnOrder={columnOrder}
        dataSource={dataSource}
        showColumnMenuTool={false}
        editable={true}
        onEditComplete={onEditComplete}
      />
      <UploadDialog 
        title='fileup-label'
        rest={'lang/upload'}
        clazz='upload'
        setMessage={setMessage}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
      />
    </div>
  );
  
}

export default LabelsEditor