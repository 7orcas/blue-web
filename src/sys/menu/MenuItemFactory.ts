import MenuItemX, { MenuItemType } from "./MenuItemX"

/*
  Convience class to create menu item wrapper objects
  Only top level menu items are added to the items array

  [Licence]
  @author John Stewart
 */
export default class MenuItemFactory {

  useLabel : any
  items : Array<MenuItemX> = []
  key : number = 0

  constructor (useLabel : any) {
    this.useLabel = useLabel
  }

  //Top level item
  main = (label : string, link : string) : MenuItemX => {
    var i = new MenuItemX(this.key++)
    i.type = MenuItemType.main
    i.link = link
    i.label = this.useLabel(label)
    this.items.push(i)
    return i
  }
  
  mainRight = (label : string, link : string) : MenuItemX => {
    var i = this.main(label, link)
    i.type = MenuItemType.main_right
    return i
  }

  //Top level item
  sub = (label : string) => {
    var i = new MenuItemX(this.key++)
    i.type = MenuItemType.sub
    i.label = this.useLabel(label)
    this.items.push(i)
    return i
  }

  item = (label : string, link : string) => {
    var i = new MenuItemX(this.key++)
    i.type = MenuItemType.item
    i.link = link
    i.label = this.useLabel(label)
    return i
  }

  subx = (label : string) => {
    var i = new MenuItemX(this.key++)
    i.type = MenuItemType.subx
    i.label = this.useLabel(label)
    return i
  }

  head = (label : string) => {
    var i = new MenuItemX(this.key++)
    i.type = MenuItemType.head
    i.label = this.useLabel(label)
    return i
  }

  div = () => {
    var i = new MenuItemX(this.key++)
    i.type = MenuItemType.div
    return i
  }
  
}
  
 
