import Session, { SessionReducer, ThemeType } from './Session'

/*
  Session state object reducer

  [Licence]
  @author John Stewart
 */


const reducer = (session : Session, action : any) => {
  switch (action.type) {

    case SessionReducer.loggedIn:
      return {...session, loggedIn: action.payload}

    case SessionReducer.userid:
      return {...session, userid: action.payload}

    case SessionReducer.params:
      return {...session, params: action.payload}
  
    case SessionReducer.lang:
      return {...session, lang: action.payload}

    case SessionReducer.orgNr:
      return {...session, orgNr: action.payload}

    case SessionReducer.tgTheme:
      return {...session, theme: session.theme === ThemeType.light ? ThemeType.dark : ThemeType.light}
    
    case SessionReducer.roles:
      return {...session, roles: action.payload}

    case SessionReducer.debugMessage:
      return {...session, debugMessage: action.payload}
    
    case SessionReducer.labels:
      return {...session, labels: action.payload}

    case SessionReducer.editLabels:
        return {...session, editLabels: session.editLabels? false : true}
      

    default:
      throw new Error()
  }
}

export default reducer