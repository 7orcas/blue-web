import { useContext, useState, useEffect } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LangLabel from '../../sys/lang/LangLabel'
import useLabel from '../../sys/lang/useLabel'
import { ErrorType } from '../../sys/system/Error'

const Footer = () => {

  const { session, error } = useContext(AppContext) as AppContextI
  const [open, setOpen] = useState (false)
  const [title, setTitle] = useState ('error')
  const [classname, setClassname] = useState ('error-dialog')

  //Watch error assignment
  useEffect(() => {
    if (error.message !== null 
      && typeof error.message !== 'undefined' 
      && error.message.length > 0) {
      
      if (error.type === ErrorType.error) {
        setTitle('error')
        setClassname('error')
      }
      if (error.type === ErrorType.warn) {
        setTitle('warn')
        setClassname('warn')
      } 
      if (error.type === ErrorType.message) {
        setTitle('message')
        setClassname('message')
      }

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
      <div className={classname + '-dialog'}>
          <div className='dialog-color'>
            <DialogTitle><LangLabel langkey={title}/></DialogTitle>
          </div>
          <DialogContent>
            <div className='dialog-content'>
              <DialogContentText style={{display : 'flex'}}>
                <LangLabel langkey='message' className='dialog-text'/>
                  <span className='dialog-text'>: {useLabel(error.message)}</span>
              </DialogContentText>
              <DialogContentText style={{display : 'flex'}}>
                <LangLabel langkey='context'/>: {error.context}
              </DialogContentText>
              <DialogContentText style={{display : 'flex'}}>
                <LangLabel langkey='detail'/>: {error.detail}
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

export default Footer
