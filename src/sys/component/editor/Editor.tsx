import { useContext, useEffect, FC } from 'react'
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
    checkboxSelection? : boolean
    useChangesPrompt?: boolean
    children: any
  }
    
  const Editor : FC<Props> = ({ 
        style,
        editorConfig, 
        setEditorConfig,
        listColumns,
        loadList, 
        loadEntity=null, 
        updateList=null,
        disableSelectionOnClick=false,
        checkboxSelection=true,
        useChangesPrompt=true,
        children }) => {
  
  const { session, setSession, setMessage, setTitle, configs, setConfigs } = useContext(AppContext) as AppContextI
  
  //Initial load 
  useEffect(() => {
    if (!editorConfig.load) {
      return
    }

    setEditorConfig ({type: EditorConfigField.load, payload : false})

    //Load entity configurations
    loadConfiguration(
      editorConfig, 
      configs,
      setConfigs,
      setSession,
      setMessage)
    
    //Load in list
    loadList()

    if (editorConfig.EDITOR_TITLE.length > 0) {
      setTitle(editorConfig.EDITOR_TITLE)
    }

  },[editorConfig.load])

  //Warn the user of unsaved changes
  usePrompt(useChangesPrompt && session.changed, setMessage);
  
  //Set the list selections (to display editors)  
  const handleSelection = (ids : GridSelectionModel) => {
    // var idsx : GridSelectionModel = []
    // ids?.forEach((id) => {
    //   if (!editorConfig.editors.includes(typeof id === 'number'? id : parseInt(id))){
    //     idsx.push(id)
    //   }
    // }) 
    onListSelectionSetEditors(editorConfig, setEditorConfig, ids, loadEntity)
  }

  //Process cell editing (if used)
  const handleRowEditCommit = (params : GridCellEditCommitParams) => {
    if (updateList !== null) {
      var ent : BaseEntI | null = getObjectById(Number(params.id), editorConfig.list)
      if (ent !== null) {
        updateList (ent, params.field, params.value)
      }
    }
  }

  //Added to prevent Select All if none selected (https://github.com/mui/mui-x/issues/1904)
  const selectAll = () : any => {
    if (editorConfig.editors.length === 0) {
      return {
        "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
          display: "none"
        }
      }
    }
    return {}
  }

  return (
    <div>
      <div className='table-grid'>
        <div style={style}>
          <DataGrid
// sx={{color: 'yellow'}} //text color
// hideFooterPagination
// hideFooter
            sx={selectAll}
            rows={editorConfig.list}
            columns={listColumns}
            pageSize={25}
            rowsPerPageOptions={[25]}
            checkboxSelection={checkboxSelection}
            selectionModel={editorConfig.editors}
            onSelectionModelChange={handleSelection}
            disableSelectionOnClick={disableSelectionOnClick}
            onCellEditCommit={handleRowEditCommit}
            getRowClassName={(params) => `table-grid-status-${params.row._caEntityStatus}`}
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

export default Editor 