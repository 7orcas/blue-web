import apiPost from '../api/apiPost'
import { SessionField } from '../system/Session'
import Message, { MessageType } from '../system/Message'

/*
  Logout utility functions

  [Licence]
  Created 21.11.22
  @author John Stewart
*/

const logout = async (setSession : any, setMessage : any) => {
  const data = await apiPost('/login/logout', {}, setMessage)
  if (typeof data !== 'undefined') {
    
    var m = new Message()
    m.type = MessageType.logout
    m.message = 'logoutm'
    setMessage(m)

    //return is encoded with either redirect or logged out
    setSession ({type: SessionField.loginStatus, payload : data.data})
    return data.data
  }
}

export default logout