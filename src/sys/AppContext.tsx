import { FC, createContext, useState, useEffect } from 'react'
import { LabelI } from './Interfaces'
import axios from './apiAxios'
import UrlSearchParams from './util/urlSearchParams'
import loadLabels from './util/loadLabels'

interface Props {
  children: any
}

export interface AppContextI {
    baseUrl: string
    org: number
    labels: LabelI[]
    setLabels: any
  }
 

const AppContext = createContext<AppContextI | null>(null)

export const AppContextProvider: FC<Props> = ({ children }) => {

  const [labels, setLabels] = useState <LabelI[]>([])
  const [baseUrl, setBaseUrl] = useState ('')

  // Load language and orgs data, setup parameters at page load
  useEffect(() => {
    const params = new UrlSearchParams()
    const initialise = async () => {
      try {
        const response = await axios.get(params.init + '?SessionID=' + params.sid, {withCredentials: true})
        setBaseUrl(response.data.data.b)
        loadLabels(response.data.data.b, setLabels)
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
      setLabels: setLabels
    }

  return (
    <AppContext.Provider value={appValue}>
      { children }
    </AppContext.Provider>
  )    
}
  
export default AppContext;