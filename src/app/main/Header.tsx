import LangLabel from '../../sys/lang/LangLabel'
import Navbar from './Navbar'

const Header = () => {

  return (
    <div className='main-header fixed-header'>
      <div className='main-title'>
        <LangLabel langkey='appname' />
      </div>
      <Navbar />
    </div>
  )
}

export default Header
