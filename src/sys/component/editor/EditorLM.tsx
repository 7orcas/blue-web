import { useContext, useEffect, FC } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import { loadConfiguration, onListSelectionSetEditors } from './editorUtil'
import { DataGrid, GridColDef, GridSelectionModel, GridCellParams } from '@mui/x-data-grid';
import usePrompt from './usePrompt';
import { EditorConfig, EditorConfigField } from './EditorConfig';
import { BaseEntI, BaseListI } from '../../definition/interfaces'

/*
  Standard List - Multi Entity - Editor

  [Licence]
  Created 27.09.22
  @author John Stewart
 */

  interface Props {
    editorConfig: EditorConfig<BaseListI, BaseEntI>
    setEditorConfig: any
    listColumns: GridColDef[] 
    loadList: any
    loadEntity: any 
    children: any
  }
    
  const EditorLM : FC<Props> = ({ 
        editorConfig, 
        setEditorConfig,
        listColumns,
        loadList, 
        loadEntity, 
        children }) => {
  
  const { session, setSession, setMessage, configs, setConfigs } = useContext(AppContext) as AppContextI
  
  //Initial load 
  useEffect(() => {

    if (!editorConfig.load) {
      return
    }

    //Load entity configurations
    loadConfiguration(
      editorConfig, 
      configs,
      setConfigs,
      setSession,
      setMessage)
    
    //Load in list
    loadList()

    setEditorConfig ({type: EditorConfigField.load, payload : false})
  },[editorConfig.load])

  //Warn the user of unsaved changes
  usePrompt(session.changed, setMessage);

  //Set the list selections (to display editors)  
  const handleSelection = (ids : GridSelectionModel) => {
    onListSelectionSetEditors(editorConfig, setEditorConfig, ids, loadEntity)
  }

  return (
      <div className='editor-multi-select'>
        <div className='editor-left table-grid'>
          <div style={{ height: '80vh', minWidth : 500, maxWidth : 500 }}>
            <DataGrid
              // sx={{color: 'yellow'}} //text color
              rows={editorConfig.list}
              columns={listColumns}
              pageSize={25}
              rowsPerPageOptions={[25]}
              checkboxSelection
              selectionModel={editorConfig.editors}
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