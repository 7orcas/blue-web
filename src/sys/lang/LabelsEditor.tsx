import { useState, useContext, useCallback, useEffect } from 'react'
import AppContext, { AppContextI } from '../context/AppContext'
import { SessionType } from '../context/Session'
import loadLabels, { LabelI } from './loadLabels'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import { ThemeType } from '../context/Session'
import '@inovua/reactdatagrid-community/index.css'
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import { TypeEditInfo } from '@inovua/reactdatagrid-community/types'
import ButtonX from '../utils/ButtonX'
import download from '../utils/download'
import Upload from '../utils/Upload'

const LabelsEditor = () => {
  
  const { session, dispatch } = useContext(AppContext) as AppContextI
  const [dataSource, setDataSource] = useState<LabelI[]>([])
  
  useEffect(() => {
    const loadLabelsX = async() => {
      var l : LabelI[] | undefined = await loadLabels('All')
      if (typeof l !== 'undefined') {
        setDataSource(l)
      }
    }
    loadLabelsX()
  },[])

  const gridStyle = { height: '80vh', margin: 20 };
  
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

  const update = () => {
    dispatch ({type: SessionType.labels, payload: dataSource})
  }

  const downloadExcel = () => {
    download(session.clientUrl, 'lang/pack/excel')
  }

  return (
    <>
      <div style={{marginLeft:'20px'}}>
        <ButtonX onClick={downloadExcel} langkey='expExcel'/>
        <Upload 
          clientUrl={session.clientUrl} 
          rest={'lang/upload'}
        />
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