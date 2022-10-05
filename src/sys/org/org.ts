import apiGet from '../api/apiGet'
import { BaseEntI, initEntBase, initEntBaseOV } from "../definition/interfaces"

/*
  Organisation's entities and load function

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

export interface OrgListI extends BaseEntI {
  dvalue: boolean
}

export interface OrgEntI extends BaseEntI {
  dvalue: boolean
}

export const loadOrgEnt = async (id : number, setSession : any, setMessage : any) => {
  try {
    const d = await apiGet(`org/get?id=${id}`, setSession, setMessage)
    var org : OrgEntI = {} as OrgEntI
    initEntBase (d, org)

    org.dvalue = d.dvalue

    initEntBaseOV (org)
    return org
  } catch (err : any) { } 
}

