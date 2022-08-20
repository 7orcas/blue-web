import './Layout.css';
import { useContext } from 'react'
import AppContext, 
  { AppContextI 
  } from '../../sys/context/AppContext'
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
    <div className='main-layout' id={session.theme}>
      <Header />
      <Body />
      <Footer />
    </div>
  )
}

export default Layout
