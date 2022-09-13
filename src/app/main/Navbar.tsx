import '../../css/Navbar.css';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import { SessionReducer, ThemeType } from '../../sys/system/Session'
import MenuItemFactory, { MenuItem, MenuItemType } from '../../sys/menu/MenuItemFactory'
import MenuX from "../../sys/menu/MenuX"
import { Menu, MenuButton } from '@szhsin/react-menu';

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
  f.main('planmat', '/')
  f.main('startmo', '/Test2')
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

  
  var themeX = f.action(session.theme === ThemeType.dark? 'themeL' : 'themeD', () => {
    setSession ({type: SessionReducer.tgTheme})
  })
  admin.menu.push(themeX)

  if (containsRole('LangEdit')) {
    var editLabel = f.checkbox('editLabels', 
      () => {setSession ({type: SessionReducer.editLabels})},
      session.editLabels
    )
    admin.menu.push(editLabel)
  }

  const setSelection = (item : MenuItem) => {
    if (item.type === MenuItemType.action || item.type === MenuItemType.checkbox) {
      item.action()
    }
    setSession ({type: SessionReducer.debugMessage, payload: item.label})
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
