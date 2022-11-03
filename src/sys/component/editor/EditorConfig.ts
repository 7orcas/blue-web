import { BaseEntI } from '../../definition/interfaces'

/*
 Class to store editor variables
 Based on list and entity objects
 
 Created 30.09.22
 [Licence]
 @author John Stewart
 */

//Used in the setEditorConfig and reducer functions
export enum EditorConfigField {
  configEntities,
  configUrl,
  newUrl,
  postUrl,
  excelUrl,
  list,
  editors,
  entities,
  load,
  tempId,
}

//Class to store editor variables
export class EditorConfig <L extends BaseEntI, E extends BaseEntI> {
  EDITOR_TITLE : string = ''
  CONFIG_ENTITIES : string[] = ['']
  CONFIG_URL : string = 'config/entity'
  POST_URL : string = ''
  EXCEL_URL : string = ''

  list : L[] = []  //left list of all records
  editors : Array<number> = []  //detailed editors (contains entity id)
  entities : Map<number,E> = new Map<number,E>()  //loaded full entities
  load : boolean = true  //flag to load editor (always initialise true)
  tempId : number = -1
}

//EditorConfig state object reducer
export const editorConfigReducer = <L extends BaseEntI, E extends BaseEntI>(editor : EditorConfig<L,E>, action : any) => {
  switch (action.type) {

    case EditorConfigField.list:
      return {...editor, list: action.payload}
      
    case EditorConfigField.editors:
      return {...editor, editors: action.payload}

    case EditorConfigField.entities:
      return {...editor, entities: action.payload}
  
    case EditorConfigField.load:
      return {...editor, load: action.payload}      

    case EditorConfigField.tempId:
      return {...editor, tempId: action.payload}

    default:
      throw new Error()
  }
}
