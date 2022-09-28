import { useState, useContext, useEffect, FC } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import TableMenu from '../../component/table/TableMenu'
import Button from '../../component/utils/Button'
import { loadConfiguration, useLabel, updateList, onListSelectionSetEditors, getObjectById } from './editor'
import { DataGrid, GridColDef, GridSelectionModel, GridCellParams, GridRowClassNameParams } from '@mui/x-data-grid';
import usePrompt from './usePrompt';
import { BaseEntI, BaseListI, ConfigI } from '../../definition/interfaces'
import { EntityStatusType as Status } from '../../definition/types';
import { MessageType, MessageReducer } from '../../system/Message'
import { ConfigReducer } from '../../system/ConfigDEL'
import apiGet from '../../api/apiGet'
import apiPost from '../../api/apiPost'

/*
  Standard List-Multi Entity Editor

  [Licence]
  Created 27.09.22
  @author John Stewart
 */

interface Props {
  configEntities: string[]
  configUrl: string
  listColumns: GridColDef[] 
  loadList: any
  loadEntity: any 
  list: BaseListI[]
  setList: any
  entities: Map<number, BaseEntI>
  setEntities: any
  editors: Array<number>
  setEditors: any
  children: any
}
  
const EditorLM : FC<Props> = ({ 
      configEntities, 
      configUrl,
      listColumns, 
      loadList, 
      loadEntity, 
      list,
      setList,
      entities, 
      setEntities, 
      editors, 
      setEditors, 
      children }) => {
  
  const { session, setSession, setMessage, configs, setConfigs } = useContext(AppContext) as AppContextI
  
  //Initial load 
  useEffect(() => {

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
  },[])

  //Warn the user of unsaved changes
  usePrompt(session.changed, setMessage);

  //Set the list selections (to display editors)  
  const handleSelection = (ids : GridSelectionModel) => {
    onListSelectionSetEditors(ids, setEditors, entities, setEntities, loadEntity)
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