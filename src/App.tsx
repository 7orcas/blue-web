import React, { useContext, useEffect }  from 'react'
import {
  BrowserRouter as Router,
  Link,
  useLocation
} from "react-router-dom";
import './App.css';
import api from './sys/api';
import Layout from './app/Layout'
import { AppContextProvider } from './sys/AppContext'


function App() {

  const url = new URL (window.location.href)
  const init = url.searchParams.get("init")
  const sid = url.searchParams.get("sid")

  useEffect(() => {

    const initialise = async () => {
      try {
        //const response = await api.post('' + init + '?SessionID=' + sid, {withCredentials: true});

        var params = new URLSearchParams()
        params.append('SessionID', '' + sid)
        var req = {
          params: params
        }
        const response = await api.get('' + init + '?SessionID=' + sid, {withCredentials: true})
        console.log('initialise: ' + response.data)

        const cookieHeaders = response.headers['set-cookie']
        console.log('cookieHeaders: ' + cookieHeaders)

      } catch (err : any) {
        console.log(err.message)
      } finally {
        
      }
    }
    initialise()
  })



  return (
    <div className="App">
      <Router>
        <AppContextProvider>
          <Layout />
        </AppContextProvider>
      </Router>
    </div>
  );
}

export default App;
