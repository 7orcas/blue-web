import useLabel from '../../sys/lang/useLabel'

const MainMenu = () => {

  var items = ['Item1', 'Item2']


  return (
    <div className='main-menu'>
      {useLabel('main menu')}
    </div>
  )
}

export default MainMenu
