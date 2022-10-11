import { useContext, useEffect } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import LangLabel from '../../sys/lang/LangLabel'
import useLabel from '../../sys/lang/useLabel'
import Navbar from './Navbar'

const Header = () => {

  const { session, title } = useContext(AppContext) as AppContextI
  const titleX = useLabel(title)
  
  useEffect(() => {
    document.title = titleX;
  },[titleX])

  return (
    <div className='main-header'>
      {session.loggedIn && <Navbar />}
      <div className='main-subheader'>
        <LangLabel langkey={title} className='main-title'/>
      </div>
    </div>
  )
}

export default Header
