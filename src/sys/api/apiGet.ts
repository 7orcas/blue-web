import axios from './apiAxios'
import { SessionField } from '../system/Session'
import Message, { MessageType } from '../system/Message'
import { JsonResponseI } from '../definition/types';

/*
  Generic GET method to contact the server

  [Licence]
  Created 1/9/22
  @author John Stewart
 */
const apiGet = async (
      url : string, 
      setMessage : (m : Message) => void,
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  var message = ''
  var detail = ''

  try {
    const response = await axios.get(`${ url }`)
    
    //Valid return object
    if (response.data.returnCode === JsonResponseI.ok) {
      return response.data.data
    }

    message = response.data.error
    detail = response.data.errorDetail

  } catch (err : any) {
    
    //UNAUTHORIZED / NO CONTENT, eg timed out
    if (err.response.status === 401 
      || err.response.status === 204) { 
      
console.log('SHOULD RELOGIN ' + err.response.status)        
      if (typeof setSession !== 'undefined') {
        setSession ({ type: SessionField.loggedIn, payload: false })
      }
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

export default apiGet