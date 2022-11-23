import { BaseEntI, initListBase, initEntBaseOV } from "../definition/interfaces"
import { EditorConfig } from '../component/editor/EditorConfig'
import apiGet from '../api/apiGet'
import Message from '../system/Message'

/*
  Logins configurations.
  Includes
  - editor configuration
  - entity interfaces
  - get (data) functions

  [Licence]
  Created 05.10.22
  @author John Stewart
 */

export interface LoginsListI extends BaseEntI {
  clientNr : number 
  //id: userid
  //username : code
  //sessionId : descr
}

export const editorConfigLogins = () : EditorConfig<LoginsListI, LoginsListI> => {
  var ed : EditorConfig<LoginsListI, LoginsListI> = new EditorConfig()
  ed.EDITOR_TITLE = 'logins'
  ed.CONFIG_ENTITIES = []
  return ed
}

//Load Login list and populate the fields
export const loadLoginList = async (
      setMessage : (m : Message) => void, 
      // eslint-disable-next-line no-empty-pattern
      setSession? : ({}) => void) => {

  try {
    const data = await apiGet('login/listcache', setMessage, setSession)

    if (typeof data !== 'undefined') {
      var list : Array<LoginsListI> = []

      for (const lst of data) {
        var ent : LoginsListI = {} as LoginsListI  
        initListBase(lst, ent)
        ent.id = lst.userid
        ent.code = lst.username
        ent.descr = lst.sessionId
        ent.clientNr = lst.clientNr
        list.push (ent)
        
        initEntBaseOV(ent)
      }

      return list
    }
  } catch (err : any) { } 
}
