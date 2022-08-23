import React, { useState, useContext, useCallback } from 'react'
import AppContext, { AppContextI } from '../context/AppContext'
import { SessionType } from '../context/Session';
import { LabelI } from './loadLabels'
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { ThemeType } from '../context/Session'
import useLabel from './useLabel'
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import { TypeEditInfo } from '@inovua/reactdatagrid-community/types';
import ButtonX from '../utils/ButtonX';

const LabelsEditor = () => {
  
  const { session, dispatch } = useContext(AppContext) as AppContextI
  const [dataSource, setDataSource] = useState<LabelI[]>(session.labels.map(l => Object.assign({}, l)))
  
  const gridStyle = { height: '80vh', margin: 20 };
  
  const columns = [
    { name: 'id', header : 'ID', type: 'number', defaultWidth: 60, editable: false },
    { name: 'org', header : 'Org', type: 'number', defaultWidth: 60, editable: false },
    { name: 'key', header : useLabel('key'), defaultFlex: 0, xdefaultLocked: 'start', editable: false },
    { name: 'label', header : useLabel('label'), defaultFlex: 1, xdefaultLocked: 'end' },
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

  const update = () => {
    dispatch ({type: SessionType.labels, payload: dataSource})
  }

  return (
    <>
      <div style={{marginLeft:'20px'}}>
      <ButtonX onClick={update} langkey='commit'/>
      </div>
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

export default LabelsEditor