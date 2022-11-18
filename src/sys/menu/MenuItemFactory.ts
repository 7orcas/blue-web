import { isRead } from '../../sys/system/Permission' 

/*
  Convience class to create menu item wrapper objects
  Only top level menu items are added to the items array

  [Licence]
  @author John Stewart
 */


export enum MenuItemType {
  main,
  main_right,
  item,
  checkbox,
  action,
  button,
  sub,
  subx,
  head,
  div
}

export class MenuItem {
  key : number = 0
  type : MenuItemType = MenuItemType.main
  link : string = ''
  label : string = ''
  permission : string | null = ''
  menu : any [] = []
  action : any
  checked : boolean = false
  addToMenu? : boolean = false

  constructor (key : number, permission : string | null) {
    this.key = key
    this.permission = permission
  }
}
  
//Check is user has
const is = (session : any, perm : string | null) => {
  if (perm === null) return true
  return isRead(session, perm)
}

export default class MenuItemFactory {

  useLabel : any
  items : Array<MenuItem> = []
  key : number = 0


  //Top level item
  main = (session : any, label : string, link : string, permission : string | null) : MenuItem | null => {
    if (!is(session, permission)) return null
    var i = new MenuItem(this.key++, permission)
    i.type = MenuItemType.main
    i.link = link
    i.label = label
    this.items.push(i)
    return i
  }
  
  mainRight = (session : any, label : string, link : string, permission : string | null) : MenuItem | null => {
    var i = this.main(session, label, link, permission)
    if (i !== null) {
      i.type = MenuItemType.main_right
    } 
    return i
  }

  //Top level sub menu
  mainSub = (label : string) : MenuItem => {
    var i = new MenuItem(this.key++, null)
    i.type = MenuItemType.sub
    i.label = label
    this.items.push(i)
    return i
  }
  
  //(Can be a) top level item
  button = (session : any, label : string, action : any, addToMenu : boolean, permission : string | null) : MenuItem | null => {
    if (!is(session, permission)) return null
    var i = new MenuItem(this.key++, permission)
    i.type = MenuItemType.button
    i.label = label
    i.action = action
    if (addToMenu === true) {
      this.items.push(i)
    }
    return i
  }

  //Add a sub menu item
  subItem = (sub : MenuItem, session : any, label : string, link : string, permission : string | null) : MenuItem | null => {
    if (!is(session, permission)) return null
    var i = new MenuItem(this.key++, permission)
    if (i !== null) {
      i.type = MenuItemType.item
      i.link = link
      i.label = label
      sub.menu.push(i)
    }
    return i
  }

  checkbox = (sub : MenuItem, session : any, label : string, action : any, checked : boolean, permission : string | null) : MenuItem | null => {
    if (!is(session, permission)) return null
    var i = new MenuItem(this.key++, permission)
    i.type = MenuItemType.checkbox
    i.label = label
    i.action = action
    i.checked = checked
    sub.menu.push(i)
    return i
  }

  action = (label : string, action : any, permission : string | null) => {
    var i = new MenuItem(this.key++, permission)
    i.type = MenuItemType.action
    i.label = label
    i.action = action
    return i
  }

  //Create a sub menu off a sub menu
  subSub = (sub : MenuItem, label : string) => {
    var i = new MenuItem(this.key++, null)
    i.type = MenuItemType.subx
    i.label = label
    sub.menu.push(i)
    return i
  }

  head = (sub : MenuItem, label : string) => {
    var i = new MenuItem(this.key++, null)
    i.type = MenuItemType.head
    i.label = label
    sub.menu.push(i)
    return i
  }

  div = (sub : MenuItem) => {
    var i = new MenuItem(this.key++, null)
    i.type = MenuItemType.div
    sub.menu.push(i)
    return i
  }
  
}
  
 
