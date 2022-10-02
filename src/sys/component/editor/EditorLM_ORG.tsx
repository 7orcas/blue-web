import { useContext, useEffect, FC } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import { loadConfiguration, onListSelectionSetEditors } from './editor'
import { DataGrid, GridColDef, GridSelectionModel, GridCellParams } from '@mui/x-data-grid';
import usePrompt from './usePrompt';
import { BaseEntI, BaseListI } from '../../definition/interfaces'

/*
  Standard List - Multi Entity - Editor

  [Licence]
  Created 27.09.22
  @author John Stewart
 */

interface Props {
  configEntities: string[]
  configUrl: string
  listColumns: GridColDef[] 
  load: boolean
  setLoad: (t: boolean) => void
  loadList: any
  loadEntity: any 
  list: BaseListI[]
  setList: any
  entities: Map<number, BaseEntI>
  setEntities: any
  editors: Array<number>
  setEditors: any
  selectionModel: Array<number> | undefined
  children: any
}
  
const EditorLM : FC<Props> = ({ 
      configEntities, 
      configUrl,
      listColumns,
      load, 
      setLoad,
      loadList, 
      loadEntity, 
      list,
      setList,
      entities, 
      setEntities, 
      editors, 
      setEditors, 
      selectionModel,
      children }) => {
  
  const { session, setSession, setMessage, configs, setConfigs } = useContext(AppContext) as AppContextI
  
  //Initial load 
  useEffect(() => {

    if (!load) {
      return
    }

    //Load entity configurations
    loadConfiguration(
      configEntities, 
      configUrl, 
      configs,
      setConfigs,
      setSession,
      setMessage)
    
    //Load in list
    loadList()

    setLoad(false)
  },[load])

  //Warn the user of unsaved changes
  usePrompt(session.changed, setMessage);

  //Set the list selections (to display editors)  
  const handleSelection = (ids : GridSelectionModel) => {

    // onListSelectionSetEditors(ids, setEditors, entities, setEntities, loadEntity)
  }

  return (
      <div className='editor-multi-select'>
        <div className='editor-left table-grid'>
          <div style={{ height: '80vh', minWidth : 500, maxWidth : 500 }}>
            <DataGrid
              // sx={{color: 'yellow'}} //text color
              rows={list}
              columns={listColumns}
              pageSize={25}
              rowsPerPageOptions={[25]}
              checkboxSelection
              selectionModel={selectionModel}
              onSelectionModelChange={handleSelection}
              getRowClassName={(params) => `table-grid-status-${params.row.entityStatus}`}
              getCellClassName={(params: GridCellParams<number>) => {
                return 'table-cell';
              }}
            />
          </div>
        </div>
        {children}
      </div>
  )
}

export default EditorLM 