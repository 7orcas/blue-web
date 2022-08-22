import React, { useState, useContext, useCallback } from 'react'
import AppContext, { AppContextI } from '../../sys/context/AppContext'
import { SessionType } from '../../sys/context/Session';
import { LabelI } from './loadLabels'
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { ThemeType } from '../../sys/context/Session'
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import { TypeEditInfo } from '@inovua/reactdatagrid-community/types';


const gridStyle = { height: '80vh', margin: 20 };

const columns = [
  { name: 'id', type: 'number', defaultWidth: 60, editable: false },
  { name: 'key', defaultFlex: 0, xdefaultLocked: 'start', editable: false },
  { name: 'label', defaultFlex: 1, xdefaultLocked: 'end' },
];
const columnOrder = ['id', 'key', 'label']

const defaultFilterValue = [
  { name: 'key', type: 'string', operator: 'contains', value: '' },
  { name: 'label', type: 'string', operator: 'contains', value: '' }
];


const LabelEditor = () => {
  
  const { session, dispatch } = useContext(AppContext) as AppContextI
  // const [dataSource, setDataSource] = useState<LabelI[]>(React.useMemo(() => session.labels.map(l => l), []))
  const [dataSource, setDataSource] = useState<LabelI[]>(session.labels.map(l => Object.assign({}, l)))
  
  // const dataSourceX : LabelI[] = React.useMemo(() => session.labels.map(l => l), [])
  // setDataSource(React.useMemo(() => session.labels.map(l => l), []))

  // const [columnOrder, setColumnOrder] = React.useState(['key', 'label']);
  
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

  const update = () => {
    dispatch ({type: SessionType.labels, payload: dataSource})
  }

  return (
    <>
      <button onClick={update}>commit</button>
      <ReactDataGrid
        idProperty='id'
        style={gridStyle}
        theme={session.theme === ThemeType.dark? 'default-dark' : 'default-light'}
        defaultFilterValue={defaultFilterValue}
        columns={columns}
        columnOrder={columnOrder}
        // onColumnOrderChange={setColumnOrder}
        dataSource={dataSource}
        showColumnMenuTool={false}
        editable={true}
        onEditComplete={onEditComplete}
      />
    </>
  );
  
}

export default LabelEditor