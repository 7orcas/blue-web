import { FC, createContext, useEffect, useReducer } from 'react'
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
  session: Session
  dispatch: any
}
 
const AppContext = createContext<AppContextI | null>(null)

export const AppContextProvider: FC<Props> = ({ children }) => {

  const [session, dispatch] = useReducer(reducer, new Session ());

  // Load app defaults
  useEffect(() => {

    const params = new UrlSearchParams()
    dispatch ({ type: SessionType.params, payload: params })

    const initialise = async () => {
      try {

        const response = await axios.get(params.init + '?SessionID=' + params.sid)

        dispatch ({ type: SessionType.userid, payload: response.data.data.userid })
        dispatch ({ type: SessionType.clientUrl, payload: response.data.data.clientUrl })
        dispatch ({ type: SessionType.lang, payload: response.data.data.lang })
        dispatch ({ type: SessionType.orgNr, payload: response.data.data.orgNr })

        var roles = response.data.data.roles.split(',')
        dispatch ({ type: SessionType.roles, payload: roles })

        const l = await loadLabels(response.data.data.clientUrl)
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
  }

  return (
    <AppContext.Provider value={appValue}>
      { children }
    </AppContext.Provider>
  )    
}
  
export default AppContext;