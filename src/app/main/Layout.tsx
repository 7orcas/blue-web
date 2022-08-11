import './Layout.css';
import Header from './Header'
import MainMenu from './MainMenu';
import Body from './Body'
import Footer from './Footer'


const Layout = () => {
  
  return (
    <div className='main-layout'>
      <Header />
      <MainMenu />
      <Body />
      <Footer />
      
    </div>
  )
}

export default Layout
