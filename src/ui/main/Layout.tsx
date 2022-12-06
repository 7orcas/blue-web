import './layout.css'
import { useContext } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import { ThemeType } from '../../sys/system/Session'
import Header from './Header'
import Router from '../router/Router'
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
      { session.busy === true && 
        <div className="busy-spinner">
          <CircularProgress color="inherit" />
        </div>}
      <Header />
      <Router />
      <Footer />
    </div>
  )
}

export default Layout
