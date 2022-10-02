import Session, { SessionField, ThemeType } from './Session'

/*
  Session state object reducer

  [Licence]
  @author John Stewart
 */


const reducer = (session : Session, action : any) => {
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
  

    default:
      throw new Error()
  }
}

export default reducer