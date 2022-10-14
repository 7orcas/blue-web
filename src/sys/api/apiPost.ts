import axios from './apiAxios'
import { SessionField } from '../system/Session'
import Message, { MessageType } from '../system/Message'
import { JsonResponseI } from '../definition/types';

/*
  Generic POST method to contact the server

  [Licence]
  Created 1/9/22
  @author John Stewart
 */
const apiPost = async (
      url : string, 
      data : any, 
      setMessage : (m : Message) => void,
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  var message = ''
  var detail = ''
  
  var m = new Message()
  m.type = MessageType.error

  try {
    const response = await axios.post(`${ url }`, data)
    
    //Valid return object
    if (response.data.returnCode === JsonResponseI.ok) {
      return response.data
    }

    if (response.data.returnCode === JsonResponseI.validationErrors) {
console.log('XXXXX')
    }

    message = response.data.error
    detail = response.data.errorDetail
    
  } catch (err : any) {
    
    //UNAUTHORIZED, ie logged out
    if (err.response.status === 401) {
      if (typeof setSession !== 'undefined') {
        setSession ({ type: SessionField.loggedIn, payload: false })
      }
      return;
    }
  
    message = err.message
  } 

  m.context = url
  m.message = message
  m.detail = detail
  setMessage(m)

  throw message
}

export default apiPost