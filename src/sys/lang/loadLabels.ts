import axios from '../api/apiAxios'
import { ErrorType } from '../system/Error'

/*
  Retieve the label package
  If laodFlag is empty the retieve all labels
  The server will only return labels for the logged in lanaguage for this client

  [Licence]
  Created Aug '22
  @author John Stewart
 */

export interface LabelI {
  id: number
  org: number
  key: string
  label: string
}

const loadLabels = async (loadFlag : string, setError : any) => {

  let loadFlagX = loadFlag === null || typeof loadFlag === 'undefined' || loadFlag.length === 0? '' : `load=${loadFlag}`

  try {
    const response = await axios.get(`lang/pack?${loadFlagX}`)
    let labels : Array<LabelI> = []
    if (response.status === 200){
      for (const l of response.data.data) {
          labels.push ({id : l.id, org : l.org, key : l.code, label : l.label})
      }
    }
    return labels

  } catch (err : any) {
    setError({ type: ErrorType.message, payload: 'loadLabels: ' + err.message })

  } 
}

export default loadLabels