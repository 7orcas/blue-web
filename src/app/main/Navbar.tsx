import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/context/AppContext'
import { SessionType } from '../../sys/context/Session'
import useLabel from '../../sys/lang/useLabel'
import MenuItemFactory from '../../sys/menu/MenuItemFactory'
import MenuItemX, { MenuItemType } from '../../sys/menu/MenuItemX'
import MenuX from "../../sys/menu/MenuX"
import {
  Menu,
  MenuButton  
  } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

/*
  Application main menu

  [Licence]
  @author John Stewart
 */
const Navbar = () => {

  const { session, dispatch } = useContext(AppContext) as AppContextI

  const f = new MenuItemFactory (useLabel)
  
  //Top Level
  f.main('planmat', '/')
  f.main('startmo', '/Test2')
  f.main('simus', '/Test2')
  var sub1 = f.sub('mastdat')
  f.main('fixes', '/Test3')
  
  //Sub menus
  sub1.menu.push(f.item('styles', '/Test3'))
  sub1.menu.push(f.item('molds', '/Test3'))
  sub1.menu.push(f.div())
  var sub2 = f.subx('xxx')
  sub1.menu.push(sub2)

  sub2.menu.push(f.head('headX'))
  sub2.menu.push(f.item('machines', '/Test3'))
  sub2.menu.push(f.item('shifts', '/Test3'))

  //Separate admin icon
  var admin = new MenuItemX(9999)
  admin.label = 'admin'
  admin.link = '/Test3'
  admin.menu.push(f.item('logout', '/Test3'))
  admin.menu.push(f.item('chgpw', '/Test3'))
  
  var themeX = f.action(session.theme === 'dark'? 'cThemeL' : 'cThemeD', () => {
    dispatch ({type: SessionType.tgTheme})
  })
  admin.menu.push(themeX)

  const setSelection = (item : MenuItemX) => {
    if (item.type === MenuItemType.action) {
      item.action()
    }
    dispatch ({type: SessionType.debugMessage, payload: item.label})
  }

  return (
    <nav className='main-menu'>
      {f.items.map(i => (
        <MenuX key={i.key} item={i} setSelection={setSelection}/>
      ))}

      {/* Admin menu option */}
      <div className='menu-item menu-item-right'>
        <Menu 
          menuButton={<MenuButton><FontAwesomeIcon icon={faBars} /></MenuButton>} transition
          >
          {admin.menu.map(i => (
            <MenuX key={i.key} item={i} setSelection={setSelection}/>
          ))}
        </Menu>
      </div>
    </nav>
  )

}

export default Navbar
