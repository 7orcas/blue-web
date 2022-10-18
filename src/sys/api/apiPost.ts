import axios from './apiAxios'
import { SessionField } from '../system/Session'
import Message, { MessageType, CommitErrorI } from '../system/Message'
import { JsonResponseI } from '../definition/types';
import { initListBase } from "../definition/interfaces"

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

    //Save Errors (from server validation)
    if (response.data.returnCode === JsonResponseI.commitErrors) {
      var errors : Array<CommitErrorI> = []
      for (const e of response.data.data.errors) {
        var ent : CommitErrorI = {} as CommitErrorI  
        initListBase(e, ent)
        ent.entityId = e.entityId
        ent.action = e.action
        ent.updated = e.updated
        ent.updatedUser = e.updatedUser
        errors.push (ent)
      }
      m.commitErrors = errors
      m.type = MessageType.commitError
      setMessage(m)
      return;
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