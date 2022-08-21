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
        const response = await axios.get(params.init + '?SessionID=' + params.sid, {withCredentials: true})
        dispatch ({type: SessionType.userid, payload: response.data.data.u})
        dispatch ({ type: SessionType.baseUrl, payload: response.data.data.b })
        dispatch ({type: SessionType.lang, payload: response.data.data.l})

        var roles = response.data.data.r.split(',')
        dispatch ({type: SessionType.roles, payload: roles})

        const l = await loadLabels(response.data.data.b)
        dispatch ({type: SessionType.labels, payload: l})
        
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