import { useContext, useState, useEffect } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LangLabel from '../../lang/LangLabel'
import useLabel from '../../lang/useLabel'
import { MessageType } from '../../system/Message'

const MessageDialog = () => {
  
  const { message, setMessage } = useContext(AppContext) as AppContextI
  const [open, setOpen] = useState (false)
  const [title, setTitle] = useState ('message')
  const [classname, setClassname] = useState ('message')

  var context = useLabel(message.context)
  var detail = useLabel(message.detail)

  //Watch message assignment
  useEffect(() => {
    if (message.type !== MessageType.none
      && message.message !== null 
      && typeof message.message !== 'undefined' 
      && message.message.length > 0) {
      
      if (message.type === MessageType.error) {
        setTitle('error')
        setClassname('error')
        setOpen(true)
      }
      if (message.type === MessageType.warn) {
        setTitle('warn')
        setClassname('warn')
        setOpen(true)
      } 
      if (message.type === MessageType.message) {
        setTitle('message')
        setClassname('message')
        setOpen(true)
      }

    }
  },[message])

  const handleClose = () => {
    setOpen (false)
    // setMessage({ type: MessageReducer.type, payload: MessageType.none })
  }

  return (
    <>
      <Dialog 
        onClose={handleClose} 
        open={open}
        PaperProps={{ sx: { position: "fixed", top: '15%', left: '30%', m: 0 } }}
      >
        <div className={classname + '-dialog'}>
            <div className='dialog-color'>
              <DialogTitle><LangLabel langkey={title}/></DialogTitle>
            </div>
            <DialogContent>
              <div className='dialog-content'>
                <DialogContentText style={{display : 'flex'}}>
                  <LangLabel langkey='message' className='dialog-text'/>
                    <span className='dialog-text'>: {useLabel(message.message)}</span>
                </DialogContentText>
                {message.type === MessageType.error &&
                  context.length > 0 &&
                  <DialogContentText style={{display : 'flex'}}>
                    <LangLabel langkey='context'/>: {context}
                  </DialogContentText>
                }
                {message.type === MessageType.error &&
                  detail.length > 0 &&
                  <DialogContentText style={{display : 'flex'}}>
                    <LangLabel langkey='detail'/>: {detail}
                  </DialogContentText>
                }
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} className='dialog-color'><LangLabel langkey='close'/></Button>
            </DialogActions>
        </div>
      </Dialog>
    </>
  )
}

export default MessageDialog
