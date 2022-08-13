import { useContext } from 'react'
import { Link } from "react-router-dom"
import AppContext, { AppContextI } from '../../sys/context/AppContext'
import MenuItem from "../../sys/menu/MenuItem"

const MainMenu = () => {

  const { setDebugMessage } = useContext(AppContext) as AppContextI

  const setSelection = (item : string) => {
    setDebugMessage(item)
  }

  return (
    <div className='main-menu'>
      <Link to="/"><MenuItem label='menu1' setSelection={setSelection}/> </Link>
      <Link to="/Test2"><MenuItem label='menu2' setSelection={setSelection}/> </Link>
      <MenuItem label='menu3' setSelection={setSelection} />
      <MenuItem label='menu4' setSelection={setSelection} />
    </div>
  )
}

export default MainMenu
