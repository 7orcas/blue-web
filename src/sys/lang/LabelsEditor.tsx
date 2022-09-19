import { useState, useContext, useCallback, useEffect } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { SessionReducer } from '../system/Session'
import loadLabels, { LabelI } from './loadLabels'
import TableMenu from '../component/table/TableMenu'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import { ThemeType } from '../system/Session'
import '@inovua/reactdatagrid-community/index.css'
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import { TypeEditInfo } from '@inovua/reactdatagrid-community/types'
import Button from '../component/utils/Button'

/*
  List, export and update language labels

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

const LabelsEditor = () => {
  
  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
  const [dataSource, setDataSource] = useState<LabelI[]>([])
  
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

  return (
    <div className='editor'>
      <div className='table-grid'>
        <div className='menu-header'>
          <TableMenu 
            exportExcelUrl='lang/pack/excel'
            uploadExcelUrl='lang/upload'
            uploadExcelLangKey='fileup-label'
          >
            <Button onClick={showInClient} langkey='showchange'/>
          </TableMenu>
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
      </div>
    </div>
  )
}

export default LabelsEditor