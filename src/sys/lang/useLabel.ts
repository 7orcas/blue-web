import { useContext } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { LangLabelAppend } from '../definition/interfaces'

/*
  Return the label value for a labelKey

  [Licence]
  Created July '22
  @author John Stewart
*/
const useLabel = (langKey : string) => {

  const { session } = useContext(AppContext) as AppContextI
  const x = session.editLabels? '?' : ''

  if (session.labels === null || typeof session.labels === 'undefined') {
    return langKey + x  
  }

  if (typeof langKey === 'undefined' || langKey === '') {
    return langKey
  }

  //Look for appended data to the langkey
  const idx = langKey.indexOf(LangLabelAppend())
  var append = ''
  var langKeyX = langKey
  if (idx !== -1) {
    append = langKey.substring(idx+1)
    langKeyX = langKey.substring(0, idx)
  }

  for (var i=0; i<session.labels.length; i++) {
    if (session.labels[i].key === langKeyX) {
      return session.labels[i].label + append
    }
  }
  return langKeyX + x + append
}

export default useLabel