import { FC } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuHeader,
  MenuDivider,
  SubMenu
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import MenuItemX, { MenuItemType } from "./MenuItemX"

/*
  Process menu items to display on page

  [Licence]
  @author John Stewart
 */


interface Props {
  item: MenuItemX 
  setSelection: any
}


const MenuX : FC<Props> = ({ item, setSelection }) => {

  return (
    <>
      {item.type === MenuItemType.main &&
        <div className='menu-item'>
          <Link to={item.link}>
            <button onClick={() => setSelection(item)}>{item.label}</button>
          </Link>
        </div>
      }

      {item.type === MenuItemType.main_right &&
        <div className='menu-item menu-item-right'>
          <Link to={item.link}>
            <button onClick={() => setSelection(item)}>{item.label}</button>
          </Link>
        </div>
      }

      {item.type === MenuItemType.item &&
        <div className='menu-item'>
          <Link to={item.link}>
            <MenuItem onClick={() => setSelection(item)}>{item.label}</MenuItem>
          </Link>
        </div>
      }

      {item.type === MenuItemType.sub &&
        <div className='menu-item'>
          <Menu 
            menuButton={<MenuButton>{item.label}</MenuButton>} transition
            theming='dark' /* not working */
            >
            {item.menu.map(i => (
              <MenuX key={i.key} item={i} setSelection={setSelection}/>
            ))}
          </Menu>
        </div>
      }

      {item.type === MenuItemType.subx &&
        <SubMenu label= {item.label}>
          {item.menu.map(i => (
            <MenuX key={i.key} item={i} setSelection={setSelection}/>
          ))}
        </SubMenu>
      }

      {item.type === MenuItemType.head && 
        <MenuHeader>{item.label}</MenuHeader>
      }

      {item.type === MenuItemType.div &&
        <MenuDivider/>
      }
    </>
  )
}

export default MenuX