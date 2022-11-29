import axios from './apiAxios'
import { SessionField } from '../system/Session'
import Message, { MessageType } from '../system/Message'
import { JsonResponseI } from '../definition/types'

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
    if (typeof setSession !== 'undefined') {
      setSession ({ type: SessionField.busy, payload: true })
    }

    const response = await axios.get(`${ url }`)
    const rtn = response.data.returnCode
    
    //Timed-out, maybe be able to relogin
    if (rtn === JsonResponseI.loggedOut
        || rtn === JsonResponseI.loginRedirect) {
      if (typeof setSession !== 'undefined') {
        setSession ({ type: SessionField.changed, payload: false })
        setSession ({ type: SessionField.loginStatus, payload: rtn })
      }
      return;
    }

    //User not authorised (ie no permission)
    if (rtn === JsonResponseI.notAuthorised) {
      if (typeof setSession !== 'undefined') {
        setSession ({ type: SessionField.changed, payload: false })
        setSession ({ type: SessionField.notAuthorised, payload: true })
      }
      return;
    }

    //Valid return object
    if (rtn === JsonResponseI.ok) {
      return response.data.data
    }

    message = response.data.error
    detail = response.data.errorDetail

  } catch (err : any) {
    
    //UNAUTHORIZED / NO CONTENT, eg timed out
    if (err.response.status === 401 
      || err.response.status === 204) { 
      if (typeof setSession !== 'undefined') {
        setSession ({ type: SessionField.loginStatus, payload: JsonResponseI.loggedOut })
      }
      return;
    }
  
    message = err.message

  } finally {
    if (typeof setSession !== 'undefined') {
      setSession ({ type: SessionField.busy, payload: false })
    }
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