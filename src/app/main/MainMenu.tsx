import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/context/AppContext'
import useLabel from '../../sys/lang/useLabel'
import MenuX, { Item, ItemX } from "../../sys/menu/MenuX"

const MainMenu = () => {

  const { session, setSession } = useContext(AppContext) as AppContextI

  var items = []
  var z = new Item ()
  z.main ('1', 'main', '/', useLabel('menu1'))
  items.push(z)

  z = new Item ()
  z.main ('2', 'main', '/Test2', useLabel('menu2'))
  items.push(z)
  
  var sub1 = new Item()
  sub1.subx (useLabel('sub1'))
  sub1.menu = []
  
  z = new Item ()
  z.item ('122', 'item', '/Test2', useLabel('menu22s'))
  sub1.menu.push(z)
        
  z = new Item ()
  z.div()
  sub1.menu.push(z)
  

  z = new Item ()
  z.item ('124', 'item', '/Test3', useLabel('menu32s'))
  sub1.menu.push(z)
   
  var x = new Item()
  x.sub (useLabel('menu3'))
  items.push(x)
  x.menu = []
  
  z = new Item ()
  z.head (useLabel('head'))
  x.menu.push(z)

  z = new Item ()
  z.item ('21', 'item', '/Test3', useLabel('menu31'))
  x.menu.push(z)

  z = new Item ()
  z.item ('22', 'item', '/Test2', useLabel('menu22'))
  x.menu.push(z)

  x.menu.push(sub1)
       
  z = new Item ()
  z.div()
  x.menu.push(z)

  z = new Item ()
  z.item ('24', 'item', '/Test3', useLabel('menu32'))
  x.menu.push(z)
        
  z = new Item ()
  z.main ('4', 'main', '/Test2', useLabel('menu4'))
  items.push(z)   
  

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
