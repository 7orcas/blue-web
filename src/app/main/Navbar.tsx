import './navbar.css';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import { SessionReducer, ThemeType } from '../../sys/system/Session'
import MenuItemFactory, { MenuItem, MenuItemType } from '../../sys/menu/MenuItemFactory'
import Menu from "../../sys/menu/Menu"
import { 
  Menu as MenuS, 
  MenuItem as MenuItemS,
  MenuButton } from '@szhsin/react-menu';

/*
  Application main menu
  Creates the menu dynamically
  User roles are checked to determine if a menu item is displayed

  [Licence]
  @author John Stewart
 */
const Navbar = () => {

  const { session, setSession } = useContext(AppContext) as AppContextI

  const f = new MenuItemFactory ()
  
  const containsRole = (role : string) : boolean => {
    return session.roles.includes(role)
  }

  //Top Level
  f.main('orgadmin', '/orgadmin')
  f.main('labeladmin', '/labels')
  f.main('planmat', '/')
  
  f.button(session.editLabels? 'editLabels|-STOP' : 'editLabels', 
    () => {setSession ({type: SessionReducer.editLabels})},
    true
  )


  f.main('simus', '/Test2')
  var sub1 = f.sub('mastdat')

  if (containsRole('Fix')) {
    f.main('fixes', '/Test3')
  }
  
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
  var admin = new MenuItem(9999)
  admin.label = 'admin'
  admin.link = '/Test3'
  admin.menu.push(f.item('logout', '/Test3'))
  admin.menu.push(f.item('chgpw', '/Test3'))
  admin.menu.push(f.div())
  admin.menu.push(f.item('labeladmin', '/labels'))
  admin.menu.push(f.item('orgadmin', '/orgadmin'))

  //Separate theme icon  
  var themeX = f.button('', 
    () => {setSession ({type: SessionReducer.tgTheme})},
    false)


  if (containsRole('LangEdit')) {
    var editLabel = f.checkbox('editLabels', 
      () => {setSession ({type: SessionReducer.editLabels})},
      session.editLabels
    )
    admin.menu.push(editLabel)
  }

  const setSelection = (item : MenuItem) => {

    if (session.changed) {
      return
    }

    if (item.type === MenuItemType.action 
      || item.type === MenuItemType.checkbox
      || item.type === MenuItemType.button) {
      item.action()
    }
    setSession ({type: SessionReducer.debugMessage, payload: item.label})
  }

  return (
    <nav className='main-menu'>
      {f.items.map(i => (
        <Menu key={i.key} item={i} setSelection={setSelection}/>
      ))}

      {/* Admin menu option */}
      <div className='menu-item menu-item-right'>
        <Menu key={998} item={themeX} setSelection={setSelection}>
          <FontAwesomeIcon icon={session.theme === ThemeType.dark? faSun : faMoon } />
        </Menu>
          <div className='last-menut-item'>
          <MenuS
            menuButton={<MenuButton><FontAwesomeIcon icon={faBars} /></MenuButton>} transition
            >
            {admin.menu.map(i => (
              <Menu key={i.key} item={i} setSelection={setSelection}/>
            ))}
          </MenuS>
          </div>
      </div>
    </nav>
  )

}

export default Navbar
