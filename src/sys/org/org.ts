import apiGet from '../api/apiGet'
import Message from '../system/Message'
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

//Load org entity
export const loadOrgEnt = async (
      id : number, 
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession : ({}) => void) => {

  try {
    const d = await apiGet(`org/get?id=${id}`, setMessage, setSession)
    var org : OrgEntI = {} as OrgEntI
    initEntBase (d, org)

    org.dvalue = d.dvalue

    initEntBaseOV (org)
    return org
  } catch (err : any) { } 
}

//Create and populate new org object
export const newOrgEnt = (l : OrgListI) : OrgEntI => {
  var e : OrgEntI = {} as OrgEntI
  initEntBase(l, e)
  e.dvalue = l.dvalue
  e._caEntityStatus = l._caEntityStatus
  return e
}