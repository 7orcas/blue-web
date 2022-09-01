import apiGet from '../api/apiGet'

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

const loadLabels = async (loadFlag : string, setSession : any, setError : any) => {

  let loadFlagX = loadFlag === null || typeof loadFlag === 'undefined' || loadFlag.length === 0? '' : `?load=${loadFlag}`

  try {
    const data = await apiGet(`lang/pack${loadFlagX}`, setSession, setError)
    let labels : Array<LabelI> = []
    
    for (const l of data) {
        labels.push ({id : l.id, org : l.org, key : l.code, label : l.label})
    }
    
    return labels
  } catch (err : any) { } 
}

export default loadLabels