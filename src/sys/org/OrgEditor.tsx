import { useState, useContext, useCallback, useEffect } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import useLabel from '../lang/useLabel'
import loadOrgs, { OrgListI } from './loadOrgs'
import OrgDetail from './OrgDetail'
import { DataGrid, GridColDef, GridSelectionModel, GridCellParams, GridRowParams, GridEventListener, GridValueGetterParams } from '@mui/x-data-grid';
import { Menu, MenuButton } from '@szhsin/react-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import MenuItemFactory, { MenuItem } from '../../sys/menu/MenuItemFactory'
import MenuX from "../../sys/menu/MenuX"
import download from '../utils/download'


/*
  List, export and update organisations

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

const OrgEditor = () => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
  
  const [dataSource, setDataSource] = useState<OrgListI[]>([])
  const [editor, setEditor] = useState<Array<number>>([])
  
  useEffect(() => {
    const loadOrgsX = async() => {
      var l : OrgListI[] | undefined = await loadOrgs('All', setSession, setMessage)
      if (typeof l !== 'undefined') {
        setDataSource(l)
      }
    }
    loadOrgsX()
  },[setSession, setMessage])


  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', type: 'number', width: 50 },
    { field: 'org', headerName: useLabel('orgnr-s'), type: 'number', width: 100 },
    { field: 'code', headerName: 'Code', width: 130, editable: true  },
    {
      field: 'dvalue',
      headerName: 'DValue',
      description: 'Default organisation',
      sortable: false,
      width: 100
    },
  ];

  const onSelectionModelChange = (ids : GridSelectionModel) => {
    let x: Array<number> = []
    if (ids !== null && typeof ids !== 'undefined') {
      ids.forEach((id) => x.push(typeof id === 'number'? id : parseInt(id)))
    }
    setEditor(x);
  }


  //Table Menu
  const f = new MenuItemFactory ()
  var tableMenu = new MenuItem(9999)
  
  var downloadX = f.action(useLabel('expExcel'), () => download('org/excel'))
  tableMenu.menu.push(downloadX)

  const setSelection = (item : MenuItem) => {
   item.action()
  }
  
  return (
    <div className='editor1'>
      <div className='editor1-left table-grid'>
        <div className='table-menu'>
          <div className='menu-item button'>
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
        <div style={{ height: '80vh', width: '100%', minWidth : 500, maxWidth : 500 }}>
          <DataGrid
            sx={{color: 'white'}}
            rows={dataSource}
            columns={columns}
            pageSize={25}
            rowsPerPageOptions={[25]}
            checkboxSelection
            onSelectionModelChange={onSelectionModelChange}
          />
        </div>
      </div>
      {editor.map((id,i) => 
        <div className='editor1-right'>
          <OrgDetail key={id} id={id}/>
        </div>
      )}
    </div>
  );

}

export default OrgEditor