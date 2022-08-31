import './App.css'
import 'normalize.css'

import Layout from './app/main/Layout'
import { AppContextProvider } from './sys/system/AppContext'

function App() {
  return (
    <div>
      <AppContextProvider>
        <Layout />
      </AppContextProvider>
    </div>
  );
}

export default App;
