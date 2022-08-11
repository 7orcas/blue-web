import './App.css'
import React, { useContext, useEffect }  from 'react'
import {
  BrowserRouter as Router,
  Link,
  useLocation
} from "react-router-dom";
import Layout from './app/main/Layout'
import { AppContextProvider } from './sys/AppContext'

function App() {
  return (
    <div>
      <Router>
        <AppContextProvider>
          <Layout />
        </AppContextProvider>
      </Router>
    </div>
  );
}

export default App;
