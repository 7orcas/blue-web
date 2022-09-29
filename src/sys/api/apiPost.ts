import axios from './apiAxios'
import { SessionReducer } from '../system/Session'
import Message, { MessageType } from '../system/Message'

/*
  Generic POST method to contact the server

  [Licence]
  Created 1/9/22
  @author John Stewart
 */
const apiPost = async (url : string, data : any, setSession : any, setMessage : any) => {
  var message = ''
  var detail = ''

  try {
    const response = await axios.post(`${ url }`, data)
    
    //Valid return object
    if (response.data.valid){
      return response.data
    }
    message = response.data.error
    detail = response.data.errorDetail
    
  } catch (err : any) {
    
    //UNAUTHORIZED, ie logged out
    if (err.response.status === 401){
      setSession ({ type: SessionReducer.loggedIn, payload: false })
      return;
    }
  
    message = err.message
  } 
  var m = new Message()
  m.type = MessageType.error
  m.context = url
  m.message = message
  m.detail = detail
  setMessage(m)

  throw message
}

export default apiPost