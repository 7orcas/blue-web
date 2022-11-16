import Message from '../system/Message'
import apiPost from './apiPost'

/*
Generic PUT method to contact the server

[Licence]
Created 16.11.22
@author John Stewart
*/

const apiPut = (
  url : string, 
  data : any, 
  setMessage : (m : Message) => void,
  // eslint-disable-next-line no-empty-pattern
  setSession? : ({}) => void
  ) => {

  return apiPost (url, data, setMessage, setSession, true)
}

export default apiPut
