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
  listUrl,
  newUrl,
  postUrl,
  excelUrl,
  list,
  editors,
  entities,
  load,
}

//Class to store editor variables
export class EditorConfig <L extends BaseEntI, E extends BaseEntI> {
  CONFIG_ENTITIES : string[] = ['']
  CONFIG_URL : string = ''
  LIST_URL : string = ''
  NEW_URL : string = ''
  POST_URL : string = ''
  EXCEL_URL : string = ''

  list : L[] = []  //left list of all records
  editors : Array<number> = []  //detailed editors (contains entity id)
  entities : Map<number,E> = new Map()  //loaded full entities
  load : boolean = true  //flag to load editor (always initialise true)
}

//EditorConfig state object reducer
export const editorConfigReducer = <L extends BaseEntI, E extends BaseEntI>(editor : EditorConfig<L,E>, action : any) => {
  switch (action.type) {

    case EditorConfigField.configEntities:
      return {...editor, CONFIG_ENTITIES: action.payload}

    case EditorConfigField.configUrl:
      return {...editor, CONFIG_URL: action.payload}

    case EditorConfigField.listUrl:
      return {...editor, LIST_URL: action.payload}
  
    case EditorConfigField.newUrl:
      return {...editor, NEW_URL: action.payload}

    case EditorConfigField.postUrl:
      return {...editor, POST_URL: action.payload}
 
    case EditorConfigField.excelUrl:
      return {...editor, EXCEL_URL: action.payload}

    case EditorConfigField.list:
      return {...editor, list: action.payload}
      
    case EditorConfigField.editors:
      return {...editor, editors: action.payload}

    case EditorConfigField.entities:
      return {...editor, entities: action.payload}
  
    case EditorConfigField.load:
      return {...editor, load: action.payload}      

    default:
      throw new Error()
  }
}




