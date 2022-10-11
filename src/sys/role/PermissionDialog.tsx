import { useContext, useEffect, FC, useState } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { PermissionListI, loadPermissionList } from './role'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid'
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
      let list = await loadPermissionList('permission/list', setMessage)
      if (typeof list !== 'undefined') {
        setList(list)
      }
      // var data = await loadListBase('permission/list', list, setMessage)
      // if (typeof data !== 'undefined') {
      //   for (var i = 0; i < data.length; i++) {
      //     var ent = list[i]
      //     ent.crud = data[i].crud
      //   }
      //   setList(list)
      // }
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
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={updateEntityX} className='dialog-color dialog-button'><LangLabel langkey='addsels' /></Button>
            <Button onClick={handleClose} className='dialog-color'><LangLabel langkey='close' /></Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  )
}

export default PermissionDialog
