import { FC, createContext, useEffect, useState, useReducer } from 'react'
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();

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

        var perms = new Map()
        for (var i=0;i<login.permissions.length;i++) {
          perms.set(login.permissions[i].perm, login.permissions[i].crud)
        }
console.log(perms) 
        setSession ({ type: SessionField.permissions, payload: perms })
        
        if (typeof login.theme !== 'undefined') {
          setSession ({ type: SessionField.tgTheme, payload: login.theme })  
        }

        const l = await loadLabels('', setMessage, setSession)
        setSession ({ type: SessionField.labels, payload: l })
        
        var gotopage = '/'
        if (typeof login.changePW !== 'undefined' && login.changePW === true) {
          gotopage = '/passchg'
        }
        
        const timer = setTimeout(() =>  {
          navigate(gotopage)
        }, 500)
        return () => clearTimeout(timer)   

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

