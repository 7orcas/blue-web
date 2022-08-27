import axios from '../api/apiAxiosUpload'
import { FC, useState } from 'react'

interface Props {
  baseUrl : string,
  rest : string,
}

const Upload : FC<Props> = ({ baseUrl, rest }) => { 

  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = useState <any> (null);

  const handleSubmit = async (event : any) => {
    event.preventDefault()
    try {
      const formData = new FormData();
      formData.append("selectedFile", selectedFile);

      const response = await axios.post(`${baseUrl}${rest}`, formData, {withCredentials: true})

      if (response.status === 200) {
console.log('uploaded....')
      }

  } catch(error) {
      console.log(error)
    }
  }

  const handleFileSelect = (event : any) => {
    setSelectedFile(event.target.files[0])
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileSelect} />
      <input type="submit" value="upFile" />
    </form>
  )
}

export default Upload;
