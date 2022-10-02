
import axios from '../api/apiAxios'

const login = async (attempt : any, setErr : any) => {

  try {
    const response = await axios.post('/login/web', attempt)
    
    if (response.data.message) {
      setErr(response.data.message)
      return false
    }

    return response.data.returnCode

  } catch (err : any) {
    setErr(err)
    return false
  }
}

export default login