import { FC, createContext, useEffect, useReducer } from 'react'
import axios from '../api/apiAxios'
import UrlSearchParams from '../api/urlSearchParams'
import loadLabels from '../lang/loadLabels'
import Session, { SessionType } from './Session'
import Error from './Error'
import reducerSession from './SessionReducer'
import reducerError from './ErrorReducer'

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
  dispatch: any
  error: Error
  setError: any
}
 
const AppContext = createContext<AppContextI | null>(null)

export const AppContextProvider: FC<Props> = ({ children }) => {

  const [session, dispatch] = useReducer(reducerSession, new Session ());
  const [error, setError] = useReducer(reducerError, new Error ());

  // Load app defaults
  useEffect(() => {

    const params = new UrlSearchParams()
    dispatch ({ type: SessionType.params, payload: params })

    const initialise = async () => {
      try {

        const response = await axios.get(params.init + '?SessionID=' + params.sid)

        dispatch ({ type: SessionType.userid, payload: response.data.data.userid })
        dispatch ({ type: SessionType.lang, payload: response.data.data.lang })
        dispatch ({ type: SessionType.orgNr, payload: response.data.data.orgNr })

        var roles = response.data.data.roles.split(',')
        dispatch ({ type: SessionType.roles, payload: roles })

        const l = await loadLabels('', setError)
        dispatch ({ type: SessionType.labels, payload: l })
        
      } catch (err : any) {
        console.log(err.message)
      } finally {
      }
    }
    initialise()
  },[])

  const appValue: AppContextI = {
    session: session,
    dispatch: dispatch,
    error: error,
    setError: setError
  }

  return (
    <AppContext.Provider value={appValue}>
      { children }
    </AppContext.Provider>
  )    
}
  
export default AppContext;