import { FC, createContext, useState } from 'react'
import api from './api';
import useAxiosFetch from './useAxiosFetch';

interface Props {
  children: any
}

export interface AppContextI {
    org: number
    lang : any
  }
 

const AppContext = createContext<AppContextI | null>(null)

export const AppContextProvider: FC<Props> = ({ children }) => {

    const [lang, setLang] = useState ('')

    const getLangPack = async () => {
      try {
        //const response = await api.get('/login2/init-web', {withCredentials: true});

        var params = new URLSearchParams()
        params.append('key', 'xxx')
        var req = {
          params: params
        }

        // const response = await api.get('/lang/value', req)
        
        // const req : any = { key: 'xxx' }
        const response = await api.get('/lang/value?key=xxx', {withCredentials: true})
        console.log(response)

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