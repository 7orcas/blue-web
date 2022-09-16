import { useState, useContext, useCallback, useEffect } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { loadList, useLabel, updateList, onListSelectionSetEditors } from '../component/editor/editor'
import { OrgListI, OrgEntI, loadOrgEnt } from './org'

import Button from '../component/utils/Button'


import OrgDetail from './OrgDetail'
import { DataGrid, GridColDef, GridSelectionModel, GridCellParams, GridRowParams, GridEventListener, GridValueGetterParams } from '@mui/x-data-grid';
import { Menu, MenuButton } from '@szhsin/react-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import MenuItemFactory, { MenuItem } from '../../sys/menu/MenuItemFactory'
import MenuX from "../../sys/menu/MenuX"
import download from '../component/utils/download'


/*
  List, export and update organisations

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

const OrgEditor = () => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
  
  //Local State
  const [list, setList] = useState<OrgListI[]>([])
  const [entities, setEntities] = useState<Map<number,OrgEntI>>(new Map())
  const [editors, setEditors] = useState<Array<number>>([])

  //Initial load of base list
  useEffect(() => {
    const loadListX = async() => {
      let list : Array<OrgListI> = []
      var data = await loadList('org/org-list', list, setSession, setMessage)
      if (typeof data !== 'undefined') {
        setList(list)
      }
    }
    loadListX()
  },[setSession, setMessage])

  //Load entity
  const loadOrgX = async(id : number) => {
    var entity : OrgEntI | undefined = await loadOrgEnt(id, setSession, setMessage)
    if (typeof entity !== 'undefined') {
      updateEntities(id, entity)
    }
  }

  //Update list and entities state
  const updateEntities = (id : number, entity : OrgEntI) => {
    setEntities(new Map(entities.set(id, entity)))
    updateList (id, entity, list, setList)
  }

  //Set the list selections (to display editors)  
  const onSelectionModelChange = (ids : GridSelectionModel) => {
    onListSelectionSetEditors(ids, setEditors, entities, loadOrgX)
  }

  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50 },
    { field: 'org', headerName: useLabel('orgnr-s'), type: 'number', width: 60 },
    { field: 'code', headerName: useLabel('code'), width: 200 },
    { field: 'active', headerName: useLabel('active'), width: 60, type: 'boolean' },
    { field: 'changed', headerName: useLabel('changed'), width: 60, type: 'boolean' },
  ];

  const handleCommit = () => {
    console.log('COMMIT')
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
          
            <Menu 
              menuButton={<MenuButton><FontAwesomeIcon icon={faBars} /></MenuButton>} transition
              className='table-menu-item'
              >
              {tableMenu.menu.map(i => (
                <MenuX key={i.key} item={i} setSelection={setSelection}/>
              ))}
            </Menu>
            
              <Button onClick={handleCommit} langkey='commit' className='menu-item'/>
            
          
        </div>
        <div style={{ height: '80vh', width: '100%', minWidth : 500, maxWidth : 500 }}>
          <DataGrid
            // sx={{color: 'yellow'}} //text color
            rows={list}
            columns={columns}
            pageSize={25}
            rowsPerPageOptions={[25]}
            checkboxSelection
            onSelectionModelChange={onSelectionModelChange}
            getCellClassName={(params: GridCellParams<number>) => {
              return 'table-cell';
            }}
          />
        </div>
      </div>
      {editors.map((id,i) => 
        <div className='editor1-right'>
          <OrgDetail 
            key={id} 
            id={id}
            org={entities.get(id)}
            updateOrg={updateEntities}
          />
        </div>
      )}
    </div>
  );

}

export default OrgEditor