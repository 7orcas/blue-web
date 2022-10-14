import { BaseEntI, initListBase, initEntBase, initEntBaseOV } from "../definition/interfaces"
import apiGet from '../api/apiGet'
import { EditorConfig } from '../component/editor/EditorConfig'
import Message from '../system/Message'

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

export const editorConfig = () : EditorConfig<OrgListI, OrgEntI> => {
  var ed : EditorConfig<OrgListI, OrgEntI> = new EditorConfig()
  ed.EDITOR_TITLE = 'orgadmin'
  ed.CONFIG_ENTITIES = ['system.org.ent.EntOrg']
  ed.POST_URL = 'org/post'
  ed.EXCEL_URL = 'org/excel'
  return ed
}

//Load Org list and populate the fields
export const loadOrgList = async (
  setMessage : (m : Message) => void, 
  // eslint-disable-next-line no-empty-pattern
  setSession? : ({}) => void) => {

  try {
    const data = await apiGet('org/list', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var list : Array<OrgListI> = []

      for (const l of data) {
        var ent : OrgListI = {} as OrgListI  
        initListBase(l, ent)
        list.push (ent)
        ent.dvalue = l.dvalue
        initEntBaseOV(ent)
      }

      return list
    }
  } catch (err : any) { } 
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

//Create new org list entity
export const newOrgList = async (
  setMessage : (m : Message) => void, 
  // eslint-disable-next-line no-empty-pattern
  setSession? : ({}) => void) => {

try {
  const data = await apiGet('org/new', setMessage, setSession)

  if (typeof data !== 'undefined') {
    var ent : OrgListI = {} as OrgListI
    for (const l of data) {
      initListBase(l, ent)
      ent.dvalue = l.dvalue
    }
    return ent
  }

} catch (err : any) {
  console.log (err)
}
}


//Create and populate new org object
export const newOrgEnt = (l : OrgListI) : OrgEntI => {
  var e : OrgEntI = {} as OrgEntI
  initEntBase(l, e)
  e.dvalue = l.dvalue
  e._caEntityStatus = l._caEntityStatus
  return e
}