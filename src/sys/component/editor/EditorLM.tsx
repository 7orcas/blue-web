import { useState, useContext, useEffect, FC } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import TableMenu from '../../component/table/TableMenu'
import Button from '../../component/utils/Button'
import { loadList as loadListXX, useLabel, updateList, onListSelectionSetEditors, getObjectById } from './editor'
import { DataGrid, GridColDef, GridSelectionModel, GridCellParams, GridRowClassNameParams } from '@mui/x-data-grid';
import usePrompt from './usePrompt';
import { BaseEntI, BaseListI, ConfigI } from '../../definition/interfaces'
import { EntityStatusType as Status } from '../../definition/types';
import { MessageType, MessageReducer } from '../../system/Message'
import { ConfigReducer } from '../../system/ConfigDEL'
import apiGet from '../../api/apiGet'
import apiPost from '../../api/apiPost'

/*
  Standard List-Multi Editor

  [Licence]
  Created 27.09.22
  @author John Stewart
 */

interface Props {
  configEntities: string[]
  listColumns: GridColDef[] 
  loadList: any
  children: any
}
  
const EditorLM : FC<Props> = ({ configEntities, listColumns, loadList, children }) => {
  
  const { session, setSession, setMessage, configs, setConfigs } = useContext(AppContext) as AppContextI
  
  //Local State
  const [newId, setNewId] = useState (0)
  const [list, setList] = useState<BaseListI[]>([])  //left list of all records
  const [entities, setEntities] = useState<Map<number,BaseEntI>>(new Map()) //loaded full entities
  const [editors, setEditors] = useState<Array<number>>([])  //detailed editors
  const [configX, setConfigX] = useState<ConfigI>()

  //Initial load 
  useEffect(() => {
    const loadConfigurations = async() => {
      for (var i=0;i<configEntities.length;i++) {
        var ce = configEntities[i]
        if (!configs.has(ce)) {
          var data = await apiGet('org/config?entity=' + ce, setSession, setMessage)
          if (typeof data !== 'undefined') {
            setConfigs(new Map(configs.set(ce, data))) 
          }
        }
        if (configs.has(ce)) {
          setConfigX(configs.get(ce))
        }
      }
    } 
    loadConfigurations()
    loadList(setList)
  },[])

  //Warn the user of unsaved changes
  usePrompt(session.changed, setMessage);

  //Load records
  // const loadList = async() => {
  //   let list : Array<BaseListI> = []
  //   var data = await loadListXX('org/list', list, setSession, setMessage)
  //   if (typeof data !== 'undefined') {
  //     setList(list)
  //   }  
  // }  


  //Load entity
  const loadOrgX = async(id : number) => {
    // var entity : BaseEntI | undefined = await loadOrgEnt(id, setSession, setMessage)
    // if (typeof entity !== 'undefined') {
    //   updateEntity(id, entity)
    // }
  }

  const updateCallback = <L extends BaseListI, E extends BaseEntI>(list : L, entity : E) => {
console.log('updateCallback')
  }

  //Update list and entities state
  const updateEntity = (id : number, entity : BaseEntI) => {
    setEntities(new Map(entities.set(id, entity)))
    updateList (id, entity, list, updateCallback, setList, setSession)
  }

  //Set the list selections (to display editors)  
  const handleSelection = (ids : GridSelectionModel) => {
    onListSelectionSetEditors(ids, setEditors, entities, loadOrgX)
  }

  //Generate temp new ids (negative)
  const getNextNewId = () => {
    var id = newId - 1
    setNewId(id)
    return id
  }

  
  const handleUpdate = async() => {
    try {
      if (entities === null) return

      for (var i=0;i<list.length;i++){
        if (list[i].entityStatus === Status.invalid) {
          setMessage({ type: MessageReducer.type, payload: MessageType.error })
          setMessage({ type: MessageReducer.message, payload: 'there are errors' }) //ToDo
          setMessage({ type: MessageReducer.detail, payload: 'must be fixed before commit' }) //ToDo
          return
        }
      }

      var newList : BaseEntI[] = []
      for (var i=0;i<list.length;i++){
        if (list[i].changed === true) {
          var e = entities.get(list[i].id)
          if (e !== null && e !== undefined) {
            newList.push(e)
          }
        }
      }
      
      const d = await apiPost(`org/post`, newList, setSession, setMessage)
      
    } catch (err : any) { } 
  }
  

  return (
    <div className='editor'>
      <div className='menu-header'>
        <TableMenu exportExcelUrl='org/excel'>
          <Button onClick={handleUpdate} langkey='save' className='table-menu-item' disabled={!session.changed}/>
          {/* <Button onClick={handleCreate} langkey='new' className='table-menu-item' /> */}
        </TableMenu>
      </div>
      <div className='editor-multi-select'>
        <div className='editor-left table-grid'>
          <div style={{ height: '40vh', minWidth : 500, maxWidth : 500 }}>
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
    </div>
  )
}

export default EditorLM 