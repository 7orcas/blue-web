import { FC, createContext, useEffect, useState, useReducer } from 'react'
import axios from '../api/apiAxios'
import UrlSearchParams from '../api/urlSearchParams'
import loadLabels from '../lang/loadLabels'
import Session, { SessionType } from './Session'
import reducer from './SessionReducer'

/*
  Application state object
  All session attibutes are managed via this object

  [Licence]
  @author John Stewart
 */

interface Props {
  children: any
}

export interface AppContextI {
    sessionOrg: Session
    setSessionOrg: any
    session: Session
    dispatch: any
    updateSession: any
    theme : string
    setTheme : any
  }
 
const AppContext = createContext<AppContextI | null>(null)

export const AppContextProvider: FC<Props> = ({ children }) => {

  const [session, dispatch] = useReducer(reducer, new Session ());
  const [sessionOrg, setSessionOrg] = useState <Session>(new Session ())
  const [theme, setTheme] = useState ('dark')

  const updateSession = (s : Session) => {
    setSessionOrg (s)
  }

  
  // Load language and orgs data, setup parameters at page load
  useEffect(() => {
    const params = new UrlSearchParams()
    dispatch ({ type: SessionType.params, payload: params })
    
    const initialise = async () => {
      try {
        const response = await axios.get(params.init + '?SessionID=' + params.sid, {withCredentials: true})
        dispatch ({ type: SessionType.baseUrl, payload: response.data.data.b })
        
        const l = await loadLabels(response.data.data.b)
        dispatch ({type: SessionType.loadLabels, payload: l})
        
      } catch (err : any) {
        console.log(err.message)
      } finally {
      }
    }
    initialise()
  },[])

    const appValue: AppContextI = {
      sessionOrg : sessionOrg,
      setSessionOrg : setSessionOrg,
      session: session,
      dispatch: dispatch,
      updateSession : updateSession,
      theme : theme,
      setTheme : setTheme
    }

  return (
    <AppContext.Provider value={appValue}>
      { children }
    </AppContext.Provider>
  )    
}
  
export default AppContext;