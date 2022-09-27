import { FC, createContext, useEffect, useState, useReducer } from 'react'
import axios from '../api/apiAxios'
import UrlSearchParams from '../api/urlSearchParams'
import loadLabels from '../lang/loadLabels'
import Session, { SessionReducer } from './Session'
import Message from './Message'
import { ConfigI } from '../definition/interfaces';
import reducerSession from './SessionReducer'
import reducerMessage from './MessageReducer'

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
  session: Session
  setSession: any
  message: Message
  setMessage: any
  configs: Map<string, ConfigI>
  setConfigs: any
}
 
const AppContext = createContext<AppContextI | null>(null)

export const AppContextProvider: FC<Props> = ({ children }) => {

  const [session, setSession] = useReducer(reducerSession, new Session ());
  const [message, setMessage] = useReducer(reducerMessage, new Message ());
  const [configs, setConfigs] = useState(new Map());

  // Load app defaults
  useEffect(() => {

    const params = new UrlSearchParams()
    setSession ({ type: SessionReducer.params, payload: params })

    const initialise = async () => {
      try {

        const response = await axios.get(params.init + '?SessionID=' + params.sid)

        setSession ({ type: SessionReducer.userid, payload: response.data.data.userid })
        setSession ({ type: SessionReducer.lang, payload: response.data.data.lang })
        setSession ({ type: SessionReducer.orgNr, payload: response.data.data.orgNr })

        var roles = response.data.data.roles.split(',')
        setSession ({ type: SessionReducer.roles, payload: roles })

        const l = await loadLabels('', setSession, setMessage)
        setSession ({ type: SessionReducer.labels, payload: l })
        
      } catch (err : any) {
        console.log(err.message)
      } finally {
      }
    }
    initialise()
  },[])

  const appValue: AppContextI = {
    session: session,
    setSession: setSession,
    message: message,
    setMessage: setMessage,
    configs: configs,
    setConfigs: setConfigs
  }

  return (
    <AppContext.Provider value={appValue}>
      { children }
    </AppContext.Provider>
  )    
}
  
export default AppContext;