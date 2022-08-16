/*
  Wrapper class to menu items

  [Licence]
  @author John Stewart
 */

export enum MenuItemType {
  main,
  main_right,
  item,
  sub,
  subx,
  head,
  div
}

export default class MenuItemX {
  key : number = 0
  type : MenuItemType = MenuItemType.main
  link : string = ''
  label : string = ''
  menu : any [] = []

  constructor (key : number) {
    this.key = key
  }
}
