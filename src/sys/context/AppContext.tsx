import { FC, createContext, useState, useEffect } from 'react'
import axios from '../api/apiAxios'
import UrlSearchParams from '../api/urlSearchParams'
import loadLabels, { LabelI } from '../lang/loadLabels'
import Session from './Session'

interface Props {
  children: any
}

export interface AppContextI {
    baseUrl: string
    org: number
    labels: LabelI[]
    setLabels: any
    debugMessage: string
    setDebugMessage: any
    session: Session
    setSession: any
  }
 

const AppContext = createContext<AppContextI | null>(null)

export const AppContextProvider: FC<Props> = ({ children }) => {

  const [labels, setLabels] = useState <LabelI[]>([])
  const [baseUrl, setBaseUrl] = useState ('')
  const [debugMessage, setDebugMessage] = useState ('')
  const [session, setSession] = useState <Session>(new Session ())

  var sessionX = new Session ()

  // Load language and orgs data, setup parameters at page load
  useEffect(() => {
    const params = new UrlSearchParams()
    sessionX.params = params

    const initialise = async () => {
      try {
        const response = await axios.get(params.init + '?SessionID=' + params.sid, {withCredentials: true})
        setBaseUrl(response.data.data.b)
        sessionX.baseUrl = response.data.data.b
        
        const l = await loadLabels(response.data.data.b)
        sessionX.labels = l!

        setSession(sessionX)
      } catch (err : any) {
        console.log(err.message)
      } finally {
      }
    }
    initialise()
  },[])

    const appValue: AppContextI = {
      baseUrl: baseUrl,
      org: 1,
      labels: labels,
      setLabels: setLabels,
      debugMessage: debugMessage,
      setDebugMessage : setDebugMessage,
      session : session,
      setSession : setSession
    }

  return (
    <AppContext.Provider value={appValue}>
      { children }
    </AppContext.Provider>
  )    
}
  
export default AppContext;