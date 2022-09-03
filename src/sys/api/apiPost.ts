import axios from './apiAxios'
import { SessionReducer } from '../system/Session'
import { ErrorType, ErrorReducer } from '../system/Error'

/*
  Generic POST method to contact the server

  [Licence]
  Created 1/9/22
  @author John Stewart
 */
const apiPost = async (url : string, data : any, setSession : any, setError : any) => {
  var message = ''
  var detail = ''

  try {
    const response = await axios.post(`${ url }`, data)
    
    //Valid return object
    if (response.data.valid){
      return response.data.message
    }
    message = response.data.message
    detail = response.data.messageDetail
    
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
  setError({ type: ErrorReducer.detail, payload: detail })
  throw message
}

export default apiPost