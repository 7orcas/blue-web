import apiGet from '../api/apiGet'

/*
  Retieve organisations

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

export interface OrgListI {
  id: number
  org: number
  code: string
  dvalue: boolean
}

const loadOrgs = async (loadFlag : string, setSession : any, setMessage : any) => {

  try {
    const data = await apiGet(`org/org-list`, setSession, setMessage)
    let orgs : Array<OrgListI> = []
    
    for (const l of data) {
        orgs.push ({id : l.id, org : l.org, code : l.code, dvalue : l.dvalue})
    }
    
    return orgs
  } catch (err : any) { } 
}

export default loadOrgs