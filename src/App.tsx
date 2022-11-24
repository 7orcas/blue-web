import { useEffect } from 'react'
import './app.css'
import './sys/component/table/table.css';
import './sys/component/editor/editor.css';
import './sys/component/dialog/dialog.css';
import './sys/component/utils/utils.css'
import 'normalize.css'

import Layout from './app/main/Layout'
import { AppContextProvider } from './sys/system/AppContext'

function App() {

  useEffect(() => {
    // Prompt confirmation when reload page is triggered
    window.onbeforeunload = () => { return "LEAVE PAGE?" };

    // return () => {
    //     window.onbeforeunload = null;
    // };
}, []);

// useEffect(() => {

//   document.addEventListener('keydown', (e) => {
//     e = e || window.event;
//     if(e.keyCode == 116){
//         e.preventDefault();
//     }
//   })

// },[])

  return (
    <div>
      <AppContextProvider>
        <Layout />
      </AppContextProvider>
    </div>
  );
}

export default App;
