import apiGet from '../api/apiGet'
import { BaseListI, BaseEntI, loadList, loadEnt } from "../component/editor/editor"

/*
  Organisations

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

export interface OrgListI extends BaseListI {}

// export const loadOrgList = async (loadFlag : string, setSession : any, setMessage : any) => {
//   try {
//     const data = await apiGet(`org/org-list`, setSession, setMessage)
//     let orgs : Array<OrgListI> = []
    
//     for (const l of data) {
//       var org : OrgListI = {} as OrgListI  
//       loadList (l, org)
//       orgs.push (org)
//     }
    
//     return orgs
//   } catch (err : any) { } 
// }


export interface OrgEntI extends BaseEntI {
  dvalue: boolean
}

export const loadOrgEnt = async (id : number, setSession : any, setMessage : any) => {
  try {
    const d = await apiGet(`org?id=${id}`, setSession, setMessage)
    var org : OrgEntI = {} as OrgEntI
    loadEnt (d, org)

    org.dvalue = d.dvalue
    org.originalValue = JSON.stringify(org)
    return org
  } catch (err : any) { } 
}

