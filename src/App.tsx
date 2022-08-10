import React, { useContext, useEffect }  from 'react'
import {
  BrowserRouter as Router,
  Link,
  useLocation
} from "react-router-dom";
import './App.css';
import Layout from './app/Layout'
import { AppContextProvider } from './sys/AppContext'

function App() {
  
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
