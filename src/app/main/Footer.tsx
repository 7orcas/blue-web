import { useContext, useState, useEffect } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LangLabel from '../../sys/lang/LangLabel'
import { ErrorType } from '../../sys/system/Error'

const Footer = () => {

  const { session, error } = useContext(AppContext) as AppContextI
  const [open, setOpen] = useState (false)
  const [title, setTitle] = useState ('error')

  //Watch error assignment
  useEffect(() => {
    if (error.message !== null 
      && typeof error.message !== 'undefined' 
      && error.message.length > 0) {
      
      if (error.type === ErrorType.error) setTitle('error')
      if (error.type === ErrorType.warn) setTitle('warn')
      if (error.type === ErrorType.message) setTitle('message')

      setOpen(true)
    }
  },[error])

  const handleClose = () => {
    setOpen (false)
  }

  return (
    <>
      <section className='main-footer'>
        {session.debugMessage + ', '}
        {error.message}
      </section>
      <Dialog onClose={handleClose} open={open}>
        <div className='error-dialog-title'>
          <DialogTitle><LangLabel langkey={title}/></DialogTitle>
        </div>
        <DialogContent>
          <div className='error-dialog-content'>
            <DialogContentText style={{display : 'flex'}}>
              <LangLabel langkey='message'/>: {error.message}
            </DialogContentText>
            <DialogContentText style={{display : 'flex'}}>
              <LangLabel langkey='context'/>: {error.context}
            </DialogContentText>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} id='error-dialog-close'><LangLabel langkey='close'/></Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Footer
