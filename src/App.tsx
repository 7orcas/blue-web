import './App.css'
import './sys/component/table/table.css';
import './sys/component/editor/editor.css';
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
