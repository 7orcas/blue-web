import { useContext, useEffect, FC, useCallback } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import { getObjectById, loadConfiguration, onListSelectionSetEditors } from './editorUtil'
import { DataGrid, GridColDef, GridSelectionModel, GridCellParams, GridCellEditCommitParams } from '@mui/x-data-grid';
import usePrompt from './usePrompt';
import { EditorConfig, EditorConfigField } from './EditorConfig';
import { BaseEntI } from '../../definition/interfaces'

/*
  Standard List - Multi Entity - Editor

  [Licence]
  Created 27.09.22
  @author John Stewart
 */

  interface Props {
    style: {}
    editorConfig: EditorConfig<BaseEntI, BaseEntI>
    setEditorConfig: any
    listColumns: GridColDef[] 
    loadList: any
    loadEntity?: any 
    updateList?: any
    disableSelectionOnClick? : boolean
    children: any
  }
    
  const EditorLM : FC<Props> = ({ 
        style,
        editorConfig, 
        setEditorConfig,
        listColumns,
        loadList, 
        loadEntity=null, 
        updateList=null,
        disableSelectionOnClick=false,
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

  const handleRowEditCommit = useCallback((params : GridCellEditCommitParams) => {
    if (updateList !== null) {
      var ent : BaseEntI | null = getObjectById(Number(params.id), editorConfig.list)
      updateList (ent, params.field, params.value)
    }
  }, [])
    


  return (
    <div className='editor-multi-select'>
      <div className='editor-left table-grid'>
        <div style={style}>
          <DataGrid
            // sx={{color: 'yellow'}} //text color
// hideFooterPagination
// hideFooter

            rows={editorConfig.list}
            columns={listColumns}
            pageSize={25}
            rowsPerPageOptions={[25]}
            checkboxSelection
            selectionModel={editorConfig.editors}
            onSelectionModelChange={handleSelection}
            disableSelectionOnClick={disableSelectionOnClick}
            onCellEditCommit={handleRowEditCommit}
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