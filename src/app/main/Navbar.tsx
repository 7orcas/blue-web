import './navbar.css';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import { SessionField, ThemeType } from '../../sys/system/Session'
import { isRead, isUpdate } from '../../sys/system/Permission' 
import MenuItemFactory, { MenuItem, MenuItemType } from '../../sys/menu/MenuItemFactory'
import Menu from "../../sys/menu/Menu"
import { Menu as MenuS, MenuButton } from '@szhsin/react-menu';

/*
  Application main menu
  Creates the menu dynamically
  User permissions are checked to determine if a menu item is displayed
  A permission check can be disabled by passing in null

  [Licence]
  @author John Stewart
 */
const Navbar = () => {

  const { session, setSession } = useContext(AppContext) as AppContextI

  const f = new MenuItemFactory ()
 
  //Top Level  (label, link, permission)
  f.main(session, 'useradmin', '/useradmin', 'user')
  f.main(session, 'roleadmin', '/roleadmin', 'role')
  f.main(session, 'permadmin', '/permadmin', 'permission')
  f.main(session, 'orgadmin', '/orgadmin', 'org')
  f.main(session, 'labeladmin', '/labels', 'lang')

  f.main(session, 'planmat', '/', null)
  
  //TESTING delete this
  f.button(session,
    session.editLabels? 'editLabels|-STOP' : 'editLabels', 
    () => {setSession ({type: SessionField.editLabels})},
    true,
    null)

  f.main(session, 'simus', '/Test2', null)
  f.main(session, 'fixes', '/Test3', null)
  
  //Sub menus
  var sub1 = f.mainSub('mastdat')
  f.subItem(sub1, session, 'styles', '/Test3', null)
  f.subItem(sub1, session, 'molds', '/Test3', null)
  f.div(sub1)
  
  var sub2 = f.subSub(sub1, 'xxx')
  f.head(sub2, 'headX')
  f.subItem(sub1, session, 'machines', '/Test3', null)
  f.subItem(sub1, session, 'shifts', '/Test3', null)


  //Separate theme icon  
  var themeX = f.button(session,
    '', () => {
    setSession ({type: SessionField.tgTheme, payload : session.theme === ThemeType.light ? ThemeType.dark : ThemeType.light})},
    false,
    null)

  //Separate admin icon
  var admin = new MenuItem(9999, null)
  admin.label = 'admin'
  admin.link = '/Test3'
  f.subItem(admin, session, 'logout', '/logout', null)
  f.subItem(admin, session, 'passchg', '/passchg', null)
  
  if (isRead(session, 'lang')) {
    f.div(admin)
    f.subItem(admin, session, 'labeladmin', '/labels', 'lang')
  }

  //Show individual label link
  if (isUpdate(session, 'lang')) {
    f.checkbox(admin,
      session,
      'editLabels', 
      () => {setSession ({type: SessionField.editLabels})},
      session.editLabels,
      'lang')
    f.div(admin)
  }

  f.subItem(admin, session, 'useradmin', '/useradmin', 'user')
  f.subItem(admin, session, 'roleadmin', '/roleadmin', 'role')
  f.subItem(admin, session, 'permadmin', '/permadmin', 'permission')
  f.subItem(admin, session, 'orgadmin', '/orgadmin', 'org')
  if (isRead(session, 'logins')) {
    f.div(admin)
    f.subItem(admin, session, 'logins', '/logins', 'logins')
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
    setSession ({type: SessionField.permission, payload: item.permission})
    setSession ({type: SessionField.debugMessage, payload: item.label})
  }

  return (
    <nav className='main-menu'>
      {f.items.map(i => (
        <Menu key={i.key} item={i} setSelection={setSelection}/>
      ))}

      {/* Admin menu option */}
      <div className='menu-item menu-item-right'>
        {themeX !== null && <Menu key={998} item={themeX} setSelection={setSelection}>
          <FontAwesomeIcon icon={session.theme === ThemeType.dark? faSun : faMoon } />
        </Menu>}
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
