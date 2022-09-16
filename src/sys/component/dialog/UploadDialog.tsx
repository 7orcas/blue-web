import axios from '../../api/apiAxiosUpload'
import { FC, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { MessageType, MessageReducer } from '../../system/Message'
import LangLabel from '../../lang/LangLabel'

interface Props {
  title: string,
  rest: string,
  clazz: string,
  setMessage: any,
  openUpload: boolean
  setOpenUpload: any
}

const UploadDialog : FC<Props> = ({ title, rest, clazz, setMessage, openUpload, setOpenUpload }) => { 

  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = useState ('');
  const [disable, setDisable] = useState (true);
  
  const handleClose = () => {
    setOpenUpload (false)
    setMessage({ type: MessageReducer.type, payload: MessageType.none })
  }

  const handleSubmit = async (event : any) => {
    event.preventDefault()
    try {
      const formData = new FormData();
      formData.append("selectedFile", selectedFile);
      const response = await axios.post(`${rest}`, formData)

      switch (response.data.returnCode) {
        case 0: //no change
          setMessage({ type: MessageReducer.type, payload: MessageType.message })
          setMessage({ type: MessageReducer.message, payload: response.data.data })
          setOpenUpload (false)
console.log('no change')          
          break

        case 1: //upload successful
          setMessage({ type: MessageReducer.type, payload: MessageType.message })
          setMessage({ type: MessageReducer.message, payload: response.data.data })
          setOpenUpload (false)
console.log('update ok')          
          break

        case -1: //upload error
          setMessage({ type: MessageReducer.type, payload: MessageType.error })
          setMessage({ type: MessageReducer.message, payload: response.data.error })
          setMessage({ type: MessageReducer.detail, payload: response.data.errorDetail })
console.log('update error')                    
          break

        default: //unknown 
          setMessage({ type: MessageReducer.type, payload: MessageType.error })
          setMessage({ type: MessageReducer.message, payload: 'errunk' })
          setMessage({ type: MessageReducer.detail, payload: 'Unknown return code' })
          break
      }


  } catch(err : any) {
      console.log(err)

      setMessage({ type: MessageReducer.type, payload: MessageType.error })
      setMessage({ type: MessageReducer.message, payload: 'errunk' })
      setMessage({ type: MessageReducer.context, payload: 'fileup' })
      setMessage({ type: MessageReducer.detail, payload: 'errstatus|: ' + err.response.status })
    }
  }

  const handleFileSelect = (event : any) => {
    setSelectedFile(event.target.files[0])
    setDisable(typeof event.target.files[0] === 'undefined'? true : false)
  }

  return (
    <>
      <Dialog 
        onClose={handleClose} 
        open={openUpload} 
        PaperProps={{ sx: { position: "fixed", top: '15%', left: '30%', m: 0 } }}
      >
        <form onSubmit={handleSubmit}>
          <div className={clazz + '-dialog'}>
            <div className='dialog-color'>
              <DialogTitle><LangLabel langkey={title}/></DialogTitle>
            </div>
            <DialogContent>
              <input id="filePicker" type="file" onChange={handleFileSelect} />
              <input id='fileUpload' type="submit" value="upFile" style={{visibility:'hidden'}} />
            </DialogContent>
            <DialogActions>
              <Button type='submit' className='dialog-color dialog-button' disabled={disable} ><LangLabel langkey='fileup' /></Button>
              <Button onClick={handleClose} className='dialog-color'><LangLabel langkey='close'/></Button>
            </DialogActions>
          </div>
        </form>
      </Dialog>
    </>              
  )
}

export default UploadDialog;
