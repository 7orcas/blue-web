import UrlSearchParams from '../api/urlSearchParams'
import { LabelI } from '../lang/loadLabels'

/*
 Class to store session variables
 
 [Licence]
 @author John Stewart
 */

//Used in the setSession and reducer functions
export enum SessionField {
  loggedIn,
  userid,
  params,
  orgNr,
  lang,
  labels,
  editLabels,
  roles,
  debugMessage,
  tgTheme,
  messageDialog,
  changed,
  busy,
}

export enum ThemeType {
  light,
  dark,
}

//Store user session variables
class Session {
  loggedIn : boolean = true
  userid : string = ''
  params : UrlSearchParams = new UrlSearchParams()
  orgNr : number = 0
  lang : string = ''
  labels : LabelI[] = []
  editLabels : boolean = false
  roles : string[] = []
  debugMessage: string = ''
  theme : ThemeType = ThemeType.dark
  messageDialog : string = ''
  changed : boolean = false
  busy: boolean = false
}

export default Session


//Session state object reducer
export const sessionReducer = (session : Session, action : any) => {
  switch (action.type) {

    case SessionField.loggedIn:
      return {...session, loggedIn: action.payload}

    case SessionField.userid:
      return {...session, userid: action.payload}

    case SessionField.params:
      return {...session, params: action.payload}
  
    case SessionField.lang:
      return {...session, lang: action.payload}

    case SessionField.orgNr:
      return {...session, orgNr: action.payload}

    case SessionField.tgTheme:
      return {...session, theme: session.theme === ThemeType.light ? ThemeType.dark : ThemeType.light}
    
    case SessionField.roles:
      return {...session, roles: action.payload}

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
      
    default:
      throw new Error()
  }
}
