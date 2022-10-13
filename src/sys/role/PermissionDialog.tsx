import { useContext, useEffect, FC, useState } from 'react'
import Draggable from 'react-draggable'
import AppContext, { AppContextI } from '../system/AppContext'
import { PermissionListI, loadPermissionList } from './role'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams, GridSelectionModel } from '@mui/x-data-grid'
import LangLabel from '../lang/LangLabel'
import { useLabel, getObjectById } from '../component/editor/editorUtil'

/*
  Dialog to show and select permissions

  [Licence]
  Created 10.10.22
  @author John Stewart
 */

interface Props {
  dialog: boolean
  setDialog: (x: boolean) => void
  updateEntity: (list : PermissionListI[]) => void
}

const PermissionDialog: FC<Props> = ({
  dialog,
  setDialog,
  updateEntity }) => {

  const { setMessage } = useContext(AppContext) as AppContextI

  //State 
  const [list, setList] = useState<PermissionListI[]>([])
  const [selection, setSelection] = useState<PermissionListI[]>([])

  //Load permissions
  useEffect(() => {
    const loadListPermission = async () => {
      let list = await loadPermissionList(setMessage)
      if (typeof list !== 'undefined') {
        setList(list)
      }
    }
    loadListPermission()
  }, [setMessage])

  const handleSelection = (ids : GridSelectionModel) => {
    var perms: Array<PermissionListI> = []

    //Iterate selected list ids
    if (ids !== null && typeof ids !== 'undefined') {
      ids.forEach((id) => {
        var ent : PermissionListI | null = getObjectById(Number(id), list)
        if (ent !== null) {
          perms.push(ent)
        }
      })
    }
    setSelection(perms) 
  }

  //Single selection
  const handleDoubleClick = (ids : GridRowParams) => {
    var perms: Array<PermissionListI> = []
    var ent : PermissionListI | null = getObjectById(Number(ids.id), list)
    if (ent !== null) {
      perms.push(ent)
    }
    updateEntity(perms) 
    setDialog(false)
  }

  const updateEntityX = () => {
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
    { field: 'crud', headerName: useLabel('crud'), width: 80, type: 'string' },
  ];

  return (
    <>
      <Draggable>
      <Dialog
        onClose={handleClose}
        open={dialog}
        
        PaperProps={{ sx: { position: "fixed", top: '5%', left: '30%', m: 0, minWidth: '630px' } }}
      >
        <div className={'permission-dialog'}>
          <div className='dialog-color'>
            <DialogTitle><LangLabel langkey='addperm' /></DialogTitle>
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
            <Button onClick={updateEntityX} className='dialog-color dialog-button'><LangLabel langkey='addsels' /></Button>
            <Button onClick={handleClose} className='dialog-color'><LangLabel langkey='close' /></Button>
          </DialogActions>
        </div>
      </Dialog>
      </Draggable>
    </>
  )
}

export default PermissionDialog
