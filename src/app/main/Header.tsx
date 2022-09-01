import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import LangLabel from '../../sys/lang/LangLabel'
import Navbar from './Navbar'

const Header = () => {

  const { session } = useContext(AppContext) as AppContextI

  return (
    <div className='main-header'>
      <div className='main-title'>
        <LangLabel langkey='appname' />
      </div>
      {session.loggedIn && <Navbar />}
    </div>
  )
}

export default Header
