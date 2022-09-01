import { useContext } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'

const useLabel = (key : string) => {

  const { session } = useContext(AppContext) as AppContextI

  if (session.labels === null || typeof session.labels === 'undefined') {
    return key + '?'  
  }

  if (key === '') {
    return key
  }

  for (var i=0; i<session.labels.length; i++) {
    if (session.labels[i].key === key)
      return session.labels[i].label
      
    }
  return key + '?'
}

export default useLabel