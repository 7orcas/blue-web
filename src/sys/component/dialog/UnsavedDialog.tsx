import { useContext, useState, useEffect } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LangLabel from '../../lang/LangLabel'
import useLabel from '../../lang/useLabel'
import { SessionReducer } from '../../system/Session'
import { MessageType, MessageReducer } from '../../system/Message'

const UnsavedDialog = () => {
  
  const { setSession, message, setMessage } = useContext(AppContext) as AppContextI
  const [open, setOpen] = useState (false)
  
  //Watch message assignment
  useEffect(() => {
    if (message.type === MessageType.unsaved) {
      setOpen(true)
    }
  },[message])

  const handleContinue = () => {
    setOpen (false)
    setSession ({type: SessionReducer.changed, payload : false})
    setMessage({ type: MessageReducer.type, payload: MessageType.none })
    message.transition.retry();
  }

  const handleCancel = () => {
    setOpen (false)
    setMessage({ type: MessageReducer.type, payload: MessageType.none })
  }

  return (
    <>
      <Dialog 
        open={open}
        PaperProps={{ sx: { position: "fixed", top: '15%', left: '30%', m: 0 } }}
      >
        <div className='warn-dialog'>
            <div className='dialog-color'>
              <DialogTitle><LangLabel langkey={'warnchanges'}/></DialogTitle>
            </div>
            {/* <DialogContent>
              <div className='dialog-content'>
                <DialogContentText style={{display : 'flex'}}>
                  <div className='dialog-text'>{useLabel('savechanges1')}</div>
                </DialogContentText>
                <DialogContentText style={{display : 'flex'}}>
                  <div className='dialog-text'>{useLabel('savechanges2')}</div>
                </DialogContentText>
              </div>
            </DialogContent> */}
            <DialogActions>
              <Button onClick={handleContinue} className='dialog-red dialog-button'><LangLabel langkey='continue'/></Button>
              <Button onClick={handleCancel} className='dialog-color'><LangLabel langkey='cancel'/></Button>
            </DialogActions>
        </div>
      </Dialog>
    </>
  )
}

export default UnsavedDialog
