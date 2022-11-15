import './navbar.css';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import { SessionField, ThemeType } from '../../sys/system/Session'
import MenuItemFactory, { MenuItem, MenuItemType } from '../../sys/menu/MenuItemFactory'
import Menu from "../../sys/menu/Menu"
import { Menu as MenuS, MenuButton } from '@szhsin/react-menu';

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
  f.main('useradmin', '/useradmin')
  f.main('roleadmin', '/roleadmin')
  f.main('permadmin', '/permadmin')
  f.main('orgadmin', '/orgadmin')
  f.main('labeladmin', '/labels')
  f.main('planmat', '/')
  
  f.button(session.editLabels? 'editLabels|-STOP' : 'editLabels', 
    () => {setSession ({type: SessionField.editLabels})},
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

  //Separate theme icon  
  var themeX = f.button('', () => {
    setSession ({type: SessionField.tgTheme, payload : session.theme === ThemeType.light ? ThemeType.dark : ThemeType.light})},
    false)

  //Separate admin icon
  var admin = new MenuItem(9999)
  admin.label = 'admin'
  admin.link = '/Test3'
  admin.menu.push(f.item('logout', '/Test3'))
  admin.menu.push(f.item('passchg', '/passchg'))
  admin.menu.push(f.div())
  admin.menu.push(f.item('labeladmin', '/labels'))

  if (containsRole('LangEdit')) {
    var editLabel = f.checkbox('editLabels', 
    () => {setSession ({type: SessionField.editLabels})},
    session.editLabels
    )
    admin.menu.push(editLabel)
    admin.menu.push(f.div())
  }
  admin.menu.push(f.item('useradmin', '/useradmin'))
  admin.menu.push(f.item('roleadmin', '/roleadmin'))
  admin.menu.push(f.item('permadmin', '/permadmin'))
  admin.menu.push(f.item('orgadmin', '/orgadmin'))


  const setSelection = (item : MenuItem) => {

    if (session.changed) {
      return
    }

    if (item.type === MenuItemType.action 
      || item.type === MenuItemType.checkbox
      || item.type === MenuItemType.button) {
      item.action()
    }
    setSession ({type: SessionField.debugMessage, payload: item.label})
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
