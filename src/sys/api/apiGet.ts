import axios from './apiAxios'
import { SessionReducer } from '../system/Session'
import { ErrorType, ErrorReducer } from '../system/Error'

/*
  Generic GET method to contact the server

  [Licence]
  Created 1/9/22
  @author John Stewart
 */
const apiGet = async (url : string, setSession : any, setError : any) => {
  var message = ''

  try {
    const response = await axios.get(`${ url }`)
    
    //Valid return object
    if (response.data.valid){
      return response.data.data
    }

    message = response.data.message

  } catch (err : any) {
    
    //UNAUTHORIZED, ie logged out
    if (err.response.status === 401){
      setSession ({ type: SessionReducer.loggedIn, payload: false })
      return;
    }
  
    message = err.message
  } 
  setError({ type: ErrorReducer.type, payload: ErrorType.error })
  setError({ type: ErrorReducer.context, payload: url })
  setError({ type: ErrorReducer.message, payload: message })
  throw message
}

export default apiGet