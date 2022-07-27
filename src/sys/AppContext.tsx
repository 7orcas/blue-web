import { FC, createContext, useState, useEffect } from 'react'
import { LabelI } from './Interfaces'
import axiosFactory from './axiosFactory'
import api from './api'
import UrlSearchParams from './util/urlSearchParams'

interface Props {
  children: any
}

export interface AppContextI {
    org: number
    loadLang: any
    labels: LabelI[]
  }
 

const AppContext = createContext<AppContextI | null>(null)

export const AppContextProvider: FC<Props> = ({ children }) => {

  const [labels, setLabels] = useState <LabelI[]>([])
  const [load, setLoad] = useState <boolean>(false)
  const [baseUrl, setBaseUrl] = useState ('')
  // const [api, setApi] = useState <any>(null)

  // Load language and orgs data, setup parameters at page load
  useEffect(() => {
    if (load === true) return
    setLoad(true)
    
    const params = new UrlSearchParams()
    const axiosInit = axiosFactory(params.baseUrl)
    const initialise = async () => {
      try {
        const response = await axiosInit.get(params.init + '?SessionID=' + params.sid, {withCredentials: true})
console.log('Got usnr:' + params.baseUrl + response.data.b)
        setBaseUrl(response.data.b)
        // setApi(axiosFactory(params.baseUrl + response.data.b))

      } catch (err : any) {
        console.log(err.message)
      } finally {
        
      }
    }
    initialise()


console.log ('base=' + params.baseUrl)

    // //Load langauge package
    // const load1 = async () => {
    //   let labels = await loadLang() || []
    //   setLang (labels)
    // }
    // load1()

  })

    const getLangPack = async () => {
      try {

        let payload = { key: 'john', id: 123}
        // var params = new URLSearchParams()
        // params.append('pack', 'login')
        
console.log('lang/pack')
        const response = await api.get(`${baseUrl}lang/pack`, {withCredentials: true})
        console.log('/lang/pack:' + response.data)
        let labels : Array<LabelI> = []
        for (const l of response.data) {
            labels.push ({key : l._c, label : l.l})
        }
        setLabels(labels)

      } catch (err : any) {
          console.log(`Error: ${err.message}`);
      }
    }

    const appValue: AppContextI = {
      org: 1,
      loadLang: getLangPack,
      labels: labels
    }

  return (
    <AppContext.Provider value={appValue}>
      { children }
    </AppContext.Provider>
  )    
}
  
export default AppContext;