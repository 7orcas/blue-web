import { useContext, useState, useEffect } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LangLabel from '../../sys/lang/LangLabel'
import useLabel from '../../sys/lang/useLabel'
import { MessageType, MessageReducer } from '../system/Message'

const MessageDialog = () => {
  
  const { message, setMessage } = useContext(AppContext) as AppContextI
  const [open, setOpen] = useState (false)
  const [title, setTitle] = useState ('message')
  const [classname, setClassname] = useState ('message')

  //Watch message assignment
  useEffect(() => {
    if (message.type !== MessageType.none
      && message.message !== null 
      && typeof message.message !== 'undefined' 
      && message.message.length > 0) {
      
      if (message.type === MessageType.error) {
        setTitle('error')
        setClassname('error')
      }
      if (message.type === MessageType.warn) {
        setTitle('warn')
        setClassname('warn')
      } 
      if (message.type === MessageType.message) {
        setTitle('message')
        setClassname('message')
      }

      setOpen(true)
    }
  },[message])

  const handleClose = () => {
    setOpen (false)
    setMessage({ type: MessageReducer.type, payload: MessageType.none })
  }

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
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
                <DialogContentText style={{display : 'flex'}}>
                  <LangLabel langkey='context'/>: {useLabel(message.context)}
                </DialogContentText>
                <DialogContentText style={{display : 'flex'}}>
                  <LangLabel langkey='detail'/>: {useLabel(message.detail)}
                </DialogContentText>
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
