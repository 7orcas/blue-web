import UrlSearchParams from '../api/urlSearchParams'
import { LabelI } from '../lang/loadLabels'
import { JsonResponseI } from '../definition/types'

/*
 Class to store session variables
 
 [Licence]
 @author John Stewart
 */

//Used in the setSession and reducer functions
export enum SessionField {
  loginStatus,
  notAuthorised,
  username,
  params,
  orgNr,
  lang, //client language to use
  labels,
  editLabels,
  permissions, //user permission list
  permission, //current permission in use set from main menu selection
  flags, //General purpose flags, eg open accordion, open editors
  debugMessage,
  tgTheme,
  messageDialog,
  changed,
  busy,
  devAdmin,
}

//Defined also in Java ApplicationI
export enum ThemeType {
  light = 0,
  dark = 1,
}

//Store user session variables
class Session {
  loginStatus : number = JsonResponseI.loggedIn
  notAuthorised : boolean = false
  username : string = ''
  params : UrlSearchParams = new UrlSearchParams()
  orgNr : number = 0
  lang : string = ''
  labels : LabelI[] = []
  editLabels : boolean = false
  permissions : Map<string,string> = new Map<string,string>()
  permission : string | null = null
  flags : Map<string,boolean> = new Map<string,boolean>()
  debugMessage: string = ''
  theme : ThemeType = ThemeType.dark
  messageDialog : string = ''
  changed : boolean = false
  busy: boolean = false
  devAdmin: boolean | null = null
}

export default Session


//Session state object reducer
export const sessionReducer = (session : Session, action : any) => {
  switch (action.type) {

    case SessionField.loginStatus:
      return {...session, loginStatus: action.payload}

    case SessionField.notAuthorised:
        return {...session, notAuthorised: action.payload}
  
    case SessionField.username:
      return {...session, username: action.payload}

    case SessionField.params:
      return {...session, params: action.payload}
  
    case SessionField.lang:
      return {...session, lang: action.payload}

    case SessionField.orgNr:
      return {...session, orgNr: action.payload}

    case SessionField.tgTheme:
      return {...session, theme: action.payload}
    
    case SessionField.permissions:
      return {...session, permissions: action.payload}

    case SessionField.permission:
        return {...session, permission: action.payload}
  
    case SessionField.flags:
      return {...session, flags: action.payload}

    case SessionField.debugMessage:
      return {...session, debugMessage: action.payload}
    
    case SessionField.labels:
      return {...session, labels: action.payload}

    case SessionField.editLabels:
      return {...session, editLabels: session.editLabels? false : true}
      
    case SessionField.messageDialog:
      return {...session, messageDialog: action.payload}

    case SessionField.changed:
      return {...session, changed: action.payload}
  
    case SessionField.busy:
      return {...session, busy: action.payload}

    case SessionField.devAdmin:
      return {...session, devAdmin: action.payload}
  

    default:
      throw new Error()
  }
}
