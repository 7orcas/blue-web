import { useState, useContext, useCallback, useEffect } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
// import useLabel from '../lang/useLabel'
import { loadList, jsonReplacer, useLabel } from '../component/editor/editor'
import { OrgListI, OrgEntI, loadOrgEnt } from './org'

// import loadOrgs, { OrgListI } from './loadOrgs'
import loadOrg, { OrgI } from './loadOrg'
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
  
  const [list, setList] = useState<OrgListI[]>([])
  const [editors, setEditors] = useState<Array<number>>([])
  const [orgs, setOrgs] = useState<Map<number,OrgEntI>>(new Map())

  //Initial load of base list
  useEffect(() => {
    const loadOrgsX = async() => {
      let orgs : Array<OrgListI> = []
      var data = await loadList(orgs, 'org/org-list', setSession, setMessage)
      if (typeof data !== 'undefined') {
        setList(orgs)
      }
    }
    loadOrgsX()
  },[setSession, setMessage])


  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50 },
    { field: 'org', headerName: useLabel('orgnr-s'), type: 'number', width: 60 },
    { field: 'code', headerName: useLabel('code'), width: 200 },
    { field: 'active', headerName: useLabel('active'), width: 60, type: 'boolean' },
    { field: 'changed', headerName: useLabel('changed'), width: 60, type: 'boolean' },
  ];


  

  const getListObject = (id : number) : OrgListI | null => {
    for (var i=0;i<list.length;i++){
      if (list[i].id === id) {
        return list[i]
      }
    }
    return null;
  }


  const updateList = (id : number, org : OrgEntI) => {
console.log('updateList id=' + id)   
    var x = JSON.stringify(org, jsonReplacer)
    var o = getListObject(id)
console.log('updateList originalValue=' + org.originalValue + '  current=' + x + '  o=' + o)         
    if (o !== null) {
      o.changed = org.originalValue !== x
      o.active = org.active
      o.code = org.code
console.log('updateList code='  + org.code)
      var l : OrgListI[] = []
      for (var i=0;i<list.length;i++){
        if (list[i].id === id) {
          l.push(o)
        } else {
          l.push(list[i])
        }
      }
      setList(l)
    }
  }

  const updateOrg = (id : number, org : OrgEntI) => {
console.log('updateOrg id=' + id)        
    setOrgs(new Map(orgs.set(id,org)))
    updateList(id, org)
  }

  const loadOrgX = async(id : number) => {
    var l : OrgEntI | undefined = await loadOrg(id, setSession, setMessage)
    if (typeof l !== 'undefined') {
      updateOrg(id,l)
    }
  }


  const onSelectionModelChange = (ids : GridSelectionModel) => {
    let x: Array<number> = []
    if (ids !== null && typeof ids !== 'undefined') {
      ids.forEach((id) => x.push(typeof id === 'number'? id : parseInt(id)))
    }
    x.map((id) => {
      if (!orgs.has(id)) {
console.log('onSelectionModelChange id=' + id)        
      loadOrgX (id)
      }
    })
    setEditors(x);
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
            org={orgs.get(id)}
            updateOrg={updateOrg}
          />
        </div>
      )}
    </div>
  );

}

export default OrgEditor