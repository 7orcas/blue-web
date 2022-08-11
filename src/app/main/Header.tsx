import useLabel from '../../sys/lang/useLabel'

const Header = () => {

  return (
    <div className='main-header'>
      {useLabel('appname')}
    </div>
  )
}

export default Header
