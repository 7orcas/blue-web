import { useContext, useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import Moment from 'moment';
import AppContext, { AppContextI } from '../../system/AppContext'
import { TS_DISPLAY } from '../../definition/interfaces'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import LangLabel from '../../lang/LangLabel'
import useLabel from '../../lang/useLabel'
import { MessageType } from '../../system/Message'

const CommitErrorDialog = () => {
  
  const { message } = useContext(AppContext) as AppContextI
  const [open, setOpen] = useState (false)
  
  //Watch message assignment
  useEffect(() => {
    if (message.type === MessageType.commitError
      && message.commitErrors.length > 0) {
      setOpen(true)
    }
  },[message])

  const handleClose = () => {
    setOpen (false)
  }

    //List Columns
    const columns: GridColDef[] = [
      { field: 'id', headerName: useLabel('id'), type: 'number', width: 50, hide: true },
      { field: 'code', headerName: useLabel('code'), width: 150, type: 'string' },
      { field: 'descr', headerName: useLabel('problem'), width: 300, type: 'string' },
      { field: 'updatedUser', headerName: useLabel('lastupby'), width: 250, type: 'string' },
      { field: 'updated', headerName: useLabel('lastup'), width: 180, 
        valueFormatter: params => Moment().format(TS_DISPLAY) },
      { field: 'action', headerName: useLabel('action'), width: 300, type: 'string' },
    ];
  
    return (
      <Draggable>
        <Dialog
          onClose={handleClose}
          open={open}
          
          PaperProps={{ sx: { position: "fixed", top: '5%', left: '30%', m: 0, minWidth: '1270px' } }}
        >
          <div className={'popup-dialog'}>
            <div className='dialog-color'>
              <DialogTitle><LangLabel langkey='valErrT' /></DialogTitle>
            </div>
            <DialogContent>
              <div style={{ height: '600px' }} className='dialog-content'>
                <DataGrid
                  rows={message.commitErrors}
                  columns={columns}
                  pageSize={9}
                  rowsPerPageOptions={[9]}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} className='dialog-color'><LangLabel langkey='close' /></Button>
            </DialogActions>
          </div>
        </Dialog>
      </Draggable>
    )
  }
  
export default CommitErrorDialog
