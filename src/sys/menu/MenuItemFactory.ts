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
  menu : any [] = []
  action : any
  checked : boolean = false
  addToMenu? : boolean = false

  constructor (key : number) {
    this.key = key
  }
}
  

export default class MenuItemFactory {

  useLabel : any
  items : Array<MenuItem> = []
  key : number = 0

  //Top level item
  main = (label : string, link : string) : MenuItem => {
    var i = new MenuItem(this.key++)
    i.type = MenuItemType.main
    i.link = link
    i.label = label
    this.items.push(i)
    return i
  }
  
  mainRight = (label : string, link : string) : MenuItem => {
    var i = this.main(label, link)
    i.type = MenuItemType.main_right
    return i
  }

  //Top level item
  sub = (label : string) => {
    var i = new MenuItem(this.key++)
    i.type = MenuItemType.sub
    i.label = label
    this.items.push(i)
    return i
  }
  
  //(Can be a) top level item
  button = (label : string, action : any, addToMenu : boolean) => {
    var i = new MenuItem(this.key++)
    i.type = MenuItemType.button
    i.label = label
    i.action = action
    if (addToMenu === true) {
      this.items.push(i)
    }
    return i
  }

  item = (label : string, link : string) => {
    var i = new MenuItem(this.key++)
    i.type = MenuItemType.item
    i.link = link
    i.label = label
    return i
  }


  checkbox = (label : string, action : any, checked : boolean) => {
    var i = new MenuItem(this.key++)
    i.type = MenuItemType.checkbox
    i.label = label
    i.action = action
    i.checked = checked
    return i
  }

  action = (label : string, action : any) => {
    var i = new MenuItem(this.key++)
    i.type = MenuItemType.action
    i.label = label
    i.action = action
    return i
  }

  subx = (label : string) => {
    var i = new MenuItem(this.key++)
    i.type = MenuItemType.subx
    i.label = label
    return i
  }

  head = (label : string) => {
    var i = new MenuItem(this.key++)
    i.type = MenuItemType.head
    i.label = label
    return i
  }

  div = () => {
    var i = new MenuItem(this.key++)
    i.type = MenuItemType.div
    return i
  }
  
}
  
 
