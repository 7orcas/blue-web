import Session, { SessionType } from './Session'

/*
  Session state object reducer

  [Licence]
  @author John Stewart
 */


const reducer = (session : Session, action : any) => {
  switch (action.type) {

    case SessionType.params:
      return {...session, params: action.payload};

    case SessionType.baseUrl:
      return {...session, baseUrl: action.payload};

    case SessionType.org:
      return {...session, org: action.payload};

    case SessionType.tgTheme:
      return {...session, theme: session.theme === 'light' ? 'dark' : 'light'};
    
    case SessionType.debugMessage:
      return {...session, debugMessage: action.payload};
    
    case SessionType.loadLabels:
      return {...session, labels: action.payload};

    default:
      throw new Error();
  }
}

export default reducer