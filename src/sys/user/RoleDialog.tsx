import { useContext, useEffect, FC, useState } from 'react'
import Draggable from 'react-draggable'
import AppContext, { AppContextI } from '../system/AppContext'
import { UserEntI, RoleListI, loadRoleList } from './user'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams, GridSelectionModel } from '@mui/x-data-grid'
import LangLabel from '../lang/LangLabel'
import { useLabel, getObjectById } from '../component/editor/editorUtil'

/*
  Dialog to show and select roles

  [Licence]
  Created 04.11.22
  @author John Stewart
 */

interface Props {
  dialog: boolean
  setDialog: (x: boolean) => void
  entity : UserEntI
  updateEntity: (list : RoleListI[]) => void
}

const RoleDialog: FC<Props> = ({
  dialog,
  setDialog,
  entity,
  updateEntity }) => {

  const { setMessage } = useContext(AppContext) as AppContextI

  //State 
  const [list, setList] = useState<RoleListI[]>([])
  const [selection, setSelection] = useState<RoleListI[]>([])

  //Load roles
  useEffect(() => {
    const loadListRole = async () => {
      let list = await loadRoleList(setMessage)
      if (typeof list !== 'undefined') {
        var listX : RoleListI[] = []
        //Filter out current roles
        for (var i=0;i<list.length;i++) {
          var found = false
          for (var j=0;j<entity.roles.length;j++) {
            if (entity.roles[j].roleId === list[i].id) found = true
          }
          if (!found) {
            listX.push(list[i])
          }
        }
        setList(listX)
      }
    }
    loadListRole()
  }, [setMessage])

  //Add checkbox selection
  const handleSelection = (ids : GridSelectionModel) => {
    var selectionX: Array<RoleListI> = []
    
    //Iterate selected list ids
    if (ids !== null && typeof ids !== 'undefined') {
      ids.forEach((id) => {
        var ent : RoleListI | null = getObjectById(Number(id), list)
        if (ent !== null) {
          selectionX.push(ent)
        }
      })
    }
    setSelection(selectionX) 
  }

  //Single selection
  const handleDoubleClick = (ids : GridRowParams) => {
    var selection: Array<RoleListI> = []
    var ent : RoleListI | null = getObjectById(Number(ids.id), list)
    if (ent !== null) {
      selection.push(ent)
    }
    updateEntity(selection) 
    setDialog(false)
  }

  //Add Selection button action
  const handleAddSelection = () => {
    updateEntity(selection)
    setDialog(false)
  }

  const handleClose = () => {
    setDialog(false)
  }

  //List Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
    { field: 'code', headerName: useLabel('url-c'), width: 150, type: 'string' },
    { field: 'descr', headerName: useLabel('desc'), width: 300, type: 'string' },
  ];

  return (
    <>
      <Draggable>
        <Dialog
          onClose={handleClose}
          open={dialog}
          
          PaperProps={{ sx: { position: "fixed", top: '5%', left: '30%', m: 0, minWidth: '630px' } }}
        >
          <div className={'popup-dialog'}>
            <div className='dialog-color'>
              <DialogTitle><LangLabel langkey='addrole' /></DialogTitle>
            </div>
            <DialogContent>
              <div style={{ height: '600px' }} className='dialog-content'>
                <DataGrid
                  rows={list}
                  columns={columns}
                  pageSize={9}
                  rowsPerPageOptions={[9]}
                  checkboxSelection
                  onSelectionModelChange={handleSelection}
                  onRowDoubleClick={handleDoubleClick}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddSelection} className='dialog-color dialog-button'><LangLabel langkey='addsels' /></Button>
              <Button onClick={handleClose} className='dialog-color'><LangLabel langkey='close' /></Button>
            </DialogActions>
          </div>
        </Dialog>
      </Draggable>
    </>
  )
}

export default RoleDialog
