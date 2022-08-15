import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/context/AppContext'
import useLabel from '../../sys/lang/useLabel'
import MenuX, { Item, ItemX } from "../../sys/menu/MenuX"

const MainMenu = () => {

  const { session, setSession } = useContext(AppContext) as AppContextI

  var items = []
  items.push(new Item ('1', 'main', '/', useLabel('menu1')))
  items.push(new Item ('2', 'main', '/Test2', useLabel('menu2')))
  
  var sub1 = new Item ('30', 'subx', '', useLabel('sub1'))
  sub1.menu = [
        new Item ('122', 'item', '/Test2', useLabel('menu22s')),
        new Item ('123', 'div', 'x', useLabel('div')),
        new Item ('124', 'item', '/Test3', useLabel('menu32s'))
      ]
    
  var x = new Item ('3', 'sub', '', useLabel('menu3'))
  items.push(x)
  x.menu = [
        new Item ('20', 'head', 'z', useLabel('head')),
        new Item ('21', 'item', '/Test3', useLabel('menu31')),
        new Item ('22', 'item', '/Test2', useLabel('menu22')),
        sub1,
        new ItemX ().div(),
        new Item ('24', 'item', '/Test3', useLabel('menu32'))
      ]
    
  items.push(new Item ('4', 'main', '/Test2', useLabel('menu4')))

  const setSelection = (item : Item) => {
    if (item.type === 'sub') item.selected = !item.selected
    
    var s = session.copy()
    s.debugMessage = item.label
    setSession(s)
  }

  return (
    <div className='main-menu'>
      {items.map(i => (
        <MenuX item={i} setSelection={setSelection}/>
      ))}
    </div>
  )

}

export default MainMenu
