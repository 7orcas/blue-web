import './App.css'
import 'normalize.css'
import { BrowserRouter as Router } from "react-router-dom";
import Layout from './app/main/Layout'
import { AppContextProvider } from './sys/context/AppContext'

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
