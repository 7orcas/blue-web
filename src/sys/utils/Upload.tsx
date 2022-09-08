import axios from '../api/apiAxiosUpload'
import { FC, useState } from 'react'
import { MessageType, MessageReducer } from '../system/Message'
import LangLabel from '../lang/LangLabel'

interface Props {
  rest : string,
  setMessage : any
}

const Upload : FC<Props> = ({ rest, setMessage }) => { 

  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = useState <any> (null);

  const handleSubmit = async (event : any) => {
    event.preventDefault()
    try {
      const formData = new FormData();
      formData.append("selectedFile", selectedFile);
      const response = await axios.post(`${rest}`, formData)

      if (response.data.returnCode === 0 || response.data.returnCode === 1) {
        setMessage({ type: MessageReducer.type, payload: MessageType.message })
        setMessage({ type: MessageReducer.message, payload: response.data.data })
      }
      else if (response.data.returnCode === -1) {
        setMessage({ type: MessageReducer.type, payload: MessageType.error })
        setMessage({ type: MessageReducer.message, payload: response.data.error })
        setMessage({ type: MessageReducer.detail, payload: response.data.errorDetail })
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
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="filePicker" style={{ background:"grey", padding:"5px 10px" }}>
      chfile
      </label>
      <input id="filePicker" type="file" onChange={handleFileSelect} style={{visibility:'hidden'}} />
      <input type="submit" value="upFile" />
    </form>
  )
}

export default Upload;
