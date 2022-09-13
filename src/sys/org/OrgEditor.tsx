import { useState, useContext, useCallback, useEffect } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import useLabel from '../lang/useLabel'
import loadOrgs, { OrgI } from './loadOrgs'
import OrgDetail from './OrgDetail'
import { DataGrid, GridColDef, GridCellParams, GridRowParams, GridEventListener, GridValueGetterParams } from '@mui/x-data-grid';



import { Menu, MenuButton } from '@szhsin/react-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import MenuItemFactory, { MenuItem } from '../../sys/menu/MenuItemFactory'
import MenuX from "../../sys/menu/MenuX"
import ReactDataGrid from '@inovua/reactdatagrid-community'
import { ThemeType } from '../system/Session'
import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox'
import '@inovua/reactdatagrid-community/index.css'
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import { TypeEditInfo } from '@inovua/reactdatagrid-community/types'
import Button from '../utils/Button'
import download from '../utils/download'


/*
  List, export and update organisations

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

const OrgEditor = () => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
  
  const [dataSource, setDataSource] = useState<OrgI[]>([])
  const [finalClickInfo, setFinalClickInfo] = useState <GridCellParams | null>(null);

  
  useEffect(() => {
    const loadOrgsX = async() => {
      var l : OrgI[] | undefined = await loadOrgs('All', setSession, setMessage)
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

  const onEditComplete = useCallback(( editInfo : TypeEditInfo )  => {
    const data : OrgI[] = [...dataSource];
    const id = parseInt(editInfo.rowId)
    for (let i=0;i<data.length;i++){
      if (data[i].id === id){
        data[i].code = editInfo.value
        break;
      }
    }
    setDataSource (data)
  }, [dataSource])


  const handleEvent: GridEventListener<'rowClick'> = (
    params : GridRowParams,
    event : any, // MuiEvent<React.MouseEvent<HTMLElement>>
    details : any, // GridCallbackDetails
  ) => {
    console.log(`Row "${params.row.__check__}" clicked`);
  };

  const handleOnCellClick = (params : GridCellParams) => {
    console.log(`Row "${params.row.__check__}" clicked`);
    setFinalClickInfo(params);
  };

  const onSelectionModelChange = (ids:any) => {
    const selectedIDs = new Set(ids);
    const selectedRowData = dataSource.filter((row) =>
      selectedIDs.has(row.id.toString())
    );
    console.log('selectedRowData=' + ids);
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
        <div style={{ height: 400, width: '40%' }}>
          <DataGrid
            sx={{color: 'white'}}
            rows={dataSource}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onRowClick={handleEvent} 
            onCellClick={handleOnCellClick}
            onSelectionModelChange={onSelectionModelChange}
          />
        </div>
      </div>
      <div className='editor1-right'>
        <OrgDetail />
        {finalClickInfo &&
        `Final clicked id = ${finalClickInfo.id}, 
        Final clicked field = ${finalClickInfo.field}, 
        Final clicked value = ${finalClickInfo.value}`}
      </div>
    </div>
  );

}

export default OrgEditor