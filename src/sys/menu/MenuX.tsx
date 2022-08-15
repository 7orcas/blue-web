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

interface Props {
  item: Item 
  setSelection: any
}

export class Item {
  key : string = ''
  type : string = ''
  link : string = ''
  label : string = ''
  menu : any [] = []
  selected : boolean = false

  main = (key : string, type : string, link : string, label : string) => {
    this.key = key
    this.type = type
    this.link = link
    this.label = label
    this.type = 'main'
  }

  item = (key : string, type : string, link : string, label : string) => {
    this.key = key
    this.type = type
    this.link = link
    this.label = label
    this.type = 'item'
  }

  sub = (label : string) => {
    this.label = label
    this.type = 'sub'
  }

  subx = (label : string) => {
    this.label = label
    this.type = 'subx'
  }

  head = (label : string) => this.type = 'head'
  div = () => this.type = 'div'
}

export class ItemX {
  key : string = ''
  type : string = ''
  link : string = ''
  label : string = ''
  menu : any [] = []
  selected : boolean = false

  div = () => this.type = 'div'
}

const MenuX : FC<Props> = ({ item, setSelection }) => {

  return (
    <>
      {item.type === 'main'?
        <div className='menu-item'>
          <Link key={item.key} to={item.link}>
            <button onClick={() => setSelection(item)}>{item.label}</button>
          </Link>
        </div>
      :''}
      {item.type === 'item'?
        <div className='menu-item'>
          <Link key={item.key} to={item.link}>
            <MenuItem onClick={() => setSelection(item)}>{item.label}</MenuItem>
          </Link>
        </div>
      :''}
      {item.type === 'sub'?
        <Menu key={item.key} menuButton={<MenuButton>{item.label}</MenuButton>} transition>
          {item.menu.map(i => (
            <MenuX item={i} setSelection={setSelection}/>
          ))}
        </Menu>
      :''}
      {item.type === 'subx'?
        <SubMenu key={item.key} label= {item.label}>
          {item.menu.map(i => (
            <MenuX item={i} setSelection={setSelection}/>
          ))}
        </SubMenu>
      :''}
      {item.type === 'head'?
        <MenuHeader key={item.key}>HEAD</MenuHeader>
      :''}
      {item.type === 'div'?
        <MenuDivider key={item.key}/>
      :''}
    </>
  )

  // return (
  //   <>
  //     {
  //       (item instanceof Item)? (
  //         <div className='menu-item'>
  //           <Link key={item.key} to={item.link}>
  //             <button onClick={() => setSelection(item)}>{item.label}</button>
  //           </Link>
  //         </div>
  //       ) : ((item instanceof SubMenu)? (
  //         <Menu key={item.key} menuButton={<MenuButton>{item.label}</MenuButton>} transition>
  //           {item.menu.map(i => (
  //             <Link key={i.key} to={i.link}>
  //               <MenuItem><button onClick={() => setSelection(i)}>{i.label}</button></MenuItem>
  //             </Link>
  //           ))}
  //         </Menu>
  //       ) : ((item instanceof Header) ? (
  //         <MenuHeader key={item.key}>item.label</MenuHeader>
  //       ) : (
  //         <MenuDivider key={item.key}/>
  //       )))
  //     }
  //   </>
  // )
}

export default MenuX