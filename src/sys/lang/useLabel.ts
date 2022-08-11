import { useContext } from 'react'
import AppContext, { AppContextI } from '../AppContext'

const useLabel = (key : string) => {

  const { labels } = useContext(AppContext) as AppContextI

  for (var i=0; i<labels.length; i++) {
    if (labels[i].key === key)
      return labels[i].label
      
    }
  return key + '?'
}

export default useLabel