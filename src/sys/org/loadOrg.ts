import apiGet from '../api/apiGet'

/*
  Retieve an organisation entity

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

export interface OrgI {
  id: number
  org: number
  code: string
  active: boolean
  dvalue: boolean
}

const loadOrg = async (id : number, setSession : any, setMessage : any) => {

  try {
    const d = await apiGet(`org?id=${id}`, setSession, setMessage)
    const org : OrgI = {
      id : d.id,
      org : d.org,
      code : d.code,
      active : d.active,
      dvalue : d.dvalue
    }

    return org
  } catch (err : any) { } 
}

export default loadOrg