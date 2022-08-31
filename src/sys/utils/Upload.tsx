import axios from '../api/apiAxiosUpload'
import { FC, useState } from 'react'

interface Props {
  clientUrl : string,
  rest : string,
}

const Upload : FC<Props> = ({ clientUrl, rest }) => { 

  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = useState <any> (null);

  const handleSubmit = async (event : any) => {
    event.preventDefault()
    try {
      const formData = new FormData();
      formData.append("selectedFile", selectedFile);
console.log(`${clientUrl}${rest}`)
      const response = await axios.post(`${clientUrl}${rest}`, formData)

      if (response.status === 200) {
console.log('uploaded.... credentials embedded ' + response.data.data)
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