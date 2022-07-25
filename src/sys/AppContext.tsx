import { FC, createContext, useState, useEffect } from 'react'
import { LangI } from './Interfaces'
import axios from 'axios';
import api from './api';
import UrlSearchParams from './util/urlSearchParams'
import loadLang from './util/loadLang'

interface Props {
  children: any
}

export interface AppContextI {
    org: number
    lang : any
  }
 

const AppContext = createContext<AppContextI | null>(null)

export const AppContextProvider: FC<Props> = ({ children }) => {

  const [lang, setLang] = useState <LangI[]>([])
  const [load, setLoad] = useState <boolean>(false)
  const [baseUrl, setBaseUrl] = useState ('')

  // Load language and orgs data, setup parameters at page load
  useEffect(() => {
    if (load === true) return
    setLoad(true)

    const params = new UrlSearchParams()
    
    const initialise = async () => {
      try {
        console.log(1)
        const response = await api.get(params.init + '?SessionID=' + params.sid, {withCredentials: true})
        console.log(2)
        setBaseUrl(response.data.b)
        console.log(3)

      } catch (err : any) {
        console.log(err.message)
      } finally {
        
      }
    }
    initialise()


console.log ('base=' + params.baseUrl)

    //Load langauge package
    const load1 = async () => {
      let labels = await loadLang() || []
      setLang (labels)
    }
    load1()

  })

    const getLangPack = async () => {
      try {

        let payload = { key: 'john', id: 123}
        // var params = new URLSearchParams()
        // params.append('pack', 'login')
        
        
        const response = await api.get(`${baseUrl}lang/pack`, {withCredentials: true})
        console.log('/lang/pack:' + response.data)

      } catch (err : any) {
          console.log(`Error: ${err.message}`);
      }
    }

    const appValue: AppContextI = {
      org: 1,
      lang: getLangPack
    }

  return (
    <AppContext.Provider value={appValue}>
      { children }
    </AppContext.Provider>
  )    
}
  
export default AppContext;