import apiGet from '../api/apiGet'
import Message from '../system/Message'

/*
  Retieve the label package
  If loadFlag is empty then retieve all labels
  The server will only return labels for the logged in lanaguage for this client

  [Licence]
  Created Aug '22
  @author John Stewart
 */

export interface LabelI {
  id: number
  orgNr: number
  key: string
  label: string
}

const loadLabels = async (
      loadFlag : string, 
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession : ({}) => void) => {

  let loadFlagX = loadFlag === null || typeof loadFlag === 'undefined' || loadFlag.length === 0? '' : `?load=${loadFlag}`

  try {
    const data = await apiGet(`lang/pack${loadFlagX}`, setMessage, setSession)
    let labels : Array<LabelI> = []
    
    for (const l of data) {
        labels.push ({id : l.id, orgNr : l.orgNr, key : l.code, label : l.label})
    }
    
    return labels
  } catch (err : any) { } 
}

export default loadLabels