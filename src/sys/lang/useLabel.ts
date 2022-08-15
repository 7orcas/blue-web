import { useContext } from 'react'
import AppContext, { AppContextI } from '../context/AppContext'

const useLabel = (key : string) => {

  const { session } = useContext(AppContext) as AppContextI

  for (var i=0; i<session.labels.length; i++) {
    if (session.labels[i].key === key)
      return session.labels[i].label
      
    }
  return key + '?'
}

export default useLabel