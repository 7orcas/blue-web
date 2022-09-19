import { FC } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu as MenuS,
  MenuItem as MenuItemS,
  MenuButton,
  MenuHeader,
  MenuDivider,
  SubMenu
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { MenuItem as MenuItemX, MenuItemType } from './MenuItemFactory'
import LangLabel from '../lang/LangLabel'

/*
  Process menu items to display on page

  [Licence]
  @author John Stewart
 */


interface Props {
  item: MenuItemX 
  setSelection: any
}


const Menu : FC<Props> = ({ item, setSelection }) => {

  return (
    <>
      {item.type === MenuItemType.main &&
        <div className='menu-item'>
          <Link to={item.link}>
            <button onClick={() => setSelection(item)}>
              <LangLabel langkey={item.label}/>
            </button>
          </Link>
        </div>
      }

      {item.type === MenuItemType.main_right &&
        <div className='menu-item menu-item-right'>
          <Link to={item.link}>
            <button onClick={() => setSelection(item)}>
              <LangLabel langkey={item.label}/>
            </button>
          </Link>
        </div>
      }

      {item.type === MenuItemType.item &&
        <div className='menu-item'>
          <Link to={item.link}>
            <MenuItemS onClick={() => setSelection(item)}>
              <LangLabel langkey={item.label}/>
            </MenuItemS>
          </Link>
        </div>
      }

      {item.type === MenuItemType.button &&
        <div className='menu-item'>
            <button onClick={() => setSelection(item)}>
              <LangLabel langkey={item.label}/>
            </button>
        </div>
      }

      {item.type === MenuItemType.action &&
        <div className='menu-item'>
          <MenuItemS onClick={() => setSelection(item)}>
            <LangLabel langkey={item.label}/>
          </MenuItemS>
        </div>
      }

      {item.type === MenuItemType.checkbox &&
        <div className={'menu-item ' + (!item.checked?'menu-item-unchecked':'')}>
          <MenuItemS 
            type='checkbox' 
            onClick={() => setSelection(item)}
            checked={item.checked}
            >
            <LangLabel langkey={item.label}/>
          </MenuItemS>
        </div>
      }

      {item.type === MenuItemType.sub &&
        <div className='menu-item'>
          <MenuS
            menuButton={<MenuButton><LangLabel langkey={item.label}/></MenuButton>} transition
            theming='dark' /* not working */
            >
            {item.menu.map(i => (
              <Menu key={i.key} item={i} setSelection={setSelection}/>
            ))}
          </MenuS>
        </div>
      }

      {item.type === MenuItemType.subx &&
        <SubMenu label= {item.label}>
          {item.menu.map(i => (
            <Menu key={i.key} item={i} setSelection={setSelection}/>
          ))}
        </SubMenu>
      }

      {item.type === MenuItemType.head && 
        <MenuHeader>
          <LangLabel langkey={item.label}/>
        </MenuHeader>
      }

      {item.type === MenuItemType.div &&
        <MenuDivider/>
      }
    </>
  )
}

export default Menu