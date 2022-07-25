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
import UrlSearchParams from './sys/util/urlSearchParams'

function App() {
  
  const params = new UrlSearchParams()

  return (
    <div className="App">
      <p>Base Url: {params.baseUrl}</p>
      <p>Initialise Url: {params.init}</p>
      <p>Session ID: {params.sid}</p>
      <Router>
        <AppContextProvider>
          <Layout />
        </AppContextProvider>
      </Router>
    </div>
  );
}

export default App;
