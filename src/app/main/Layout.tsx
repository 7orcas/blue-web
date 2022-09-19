import './layout.css'
import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import { ThemeType } from '../../sys/system/Session'
import Header from './Header'
import Body from '../body/Body'
import Footer from './Footer'

/*
  Home page for the application

  [Licence]
  @author John Stewart
 */

const Layout = () => {
  
  const { session } = useContext(AppContext) as AppContextI

  return (
    <div className='main-layout' id={session.theme === ThemeType.light ? 'light' : 'dark'}>
      <Header />
      <Body />
      <Footer />
    </div>
  )
}

export default Layout
