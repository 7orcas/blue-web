import apiGet from '../api/apiGet'
import { BaseListI, BaseEntI } from "../definition/interfaces"
import { loadEnt } from '../component/editor/editor'

/*
  Organisation's entities and load function

  [Licence]
  Created 13.09.22
  @author John Stewart
 */

export interface OrgListI extends BaseListI {}

export interface OrgEntI extends BaseEntI {
  dvalue: boolean
}

export const loadOrgEnt = async (id : number, setSession : any, setMessage : any) => {
  try {
    const d = await apiGet(`org/get?id=${id}`, setSession, setMessage)
    var org : OrgEntI = {} as OrgEntI
    loadEnt (d, org)

    org.dvalue = d.dvalue
    org.originalValue = JSON.stringify(org)
    return org
  } catch (err : any) { } 
}

