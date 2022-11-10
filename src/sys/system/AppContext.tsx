import { FC, createContext, useEffect, useState, useReducer } from 'react'
import axios from '../api/apiAxios'
import UrlSearchParams from '../api/urlSearchParams'
import loadLabels from '../lang/loadLabels'
import Session, { SessionField, sessionReducer } from './Session'
import Message from './Message'
import { ConfigI } from '../definition/interfaces';
import apiPut from '../api/apiPutUserConfig'

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
  title: string
  setTitle: (x: string) => void
  message: Message
  setMessage: any
  configs: Map<string, ConfigI>
  setConfigs: any
}
 
const AppContext = createContext<AppContextI | null>(null)

export const AppContextProvider: FC<Props> = ({ children }) => {

  const [session, setSession] = useReducer(sessionReducer, new Session ());
  const [message, setMessage] = useState(new Message());
  const [configs, setConfigs] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('appname');

  // Load app defaults
  useEffect(() => {

    const params = new UrlSearchParams()
    setSession ({ type: SessionField.params, payload: params })

    const initialise = async () => {
      try {
        const response = await axios.get(params.init + '?SessionID=' + params.sid)
        var login = response.data.data

        setSession ({ type: SessionField.userid, payload: login.userid })
        setSession ({ type: SessionField.lang, payload: login.lang })
        setSession ({ type: SessionField.orgNr, payload: login.orgNr })

        var roles = login.roles.split(',')
        setSession ({ type: SessionField.roles, payload: roles })
        
        if (typeof login.theme !== 'undefined') {
          setSession ({ type: SessionField.tgTheme, payload: login.theme })  
        }

        const l = await loadLabels('', setMessage, setSession)
        setSession ({ type: SessionField.labels, payload: l })
        
      } catch (err : any) {
        console.log(err.message)

      } finally {
        const timer = setTimeout(() =>  {
          setLoading(false)
        }, 500)
        return () => clearTimeout(timer)   
      }
    }
    initialise()
  },[])

  useEffect(() => {
    if (!loading) {
console.log('useEffect ' + session.theme)
      apiPut('theme', session.theme.toString())
    }
  },[session.theme])

  const appValue: AppContextI = {
    session: session,
    setSession: setSession,
    title: title,
    setTitle: setTitle,
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

