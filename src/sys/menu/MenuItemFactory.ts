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

  //Top level item
  main = (label : string, link : string) : MenuItemX => {
    var i = new MenuItemX(this.key++)
    i.type = MenuItemType.main
    i.link = link
    i.label = label
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
    i.label = label
    this.items.push(i)
    return i
  }

  item = (label : string, link : string) => {
    var i = new MenuItemX(this.key++)
    i.type = MenuItemType.item
    i.link = link
    i.label = label
    return i
  }

  checkbox = (label : string, action : any, checked : boolean) => {
    var i = new MenuItemX(this.key++)
    i.type = MenuItemType.checkbox
    i.label = label
    i.action = action
    i.checked = checked
    return i
  }

  action = (label : string, action : any) => {
    var i = new MenuItemX(this.key++)
    i.type = MenuItemType.action
    i.label = label
    i.action = action
    return i
  }

  subx = (label : string) => {
    var i = new MenuItemX(this.key++)
    i.type = MenuItemType.subx
    i.label = label
    return i
  }

  head = (label : string) => {
    var i = new MenuItemX(this.key++)
    i.type = MenuItemType.head
    i.label = label
    return i
  }

  div = () => {
    var i = new MenuItemX(this.key++)
    i.type = MenuItemType.div
    return i
  }
  
}
  
 