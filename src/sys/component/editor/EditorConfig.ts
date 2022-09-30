import { BaseListI, BaseEntI } from '../../definition/interfaces'

/*
 Class to store editor variables
 
 Created 30.09.22
 [Licence]
 @author John Stewart
 */

//Used in the setEditorConfig and reducer functions
export enum EditorConfigReducer {
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


export class EditorConfig <L extends BaseListI, E extends BaseEntI> {
  CONFIG_ENTITIES : string[] = ['']
  CONFIG_URL : string = ''
  LIST_URL : string = ''
  NEW_URL : string = ''
  POST_URL : string = ''
  EXCEL_URL : string = ''

  list : L[] = []  //left list of all records
  editors : Array<number> = []  //detailed editors (contains entity id)
  entities : E[] = []  //loaded full entities
  load : boolean = true  //flag to load editor (always initialise true)
}

//EditorConfig state object reducer
export const editorConfigRducer = <L extends BaseListI, E extends BaseEntI>(editor : EditorConfig<L,E>, action : any) => {
  switch (action.type) {

    case EditorConfigReducer.configEntities:
      return {...editor, CONFIG_ENTITIES: action.payload}

    case EditorConfigReducer.configUrl:
      return {...editor, CONFIG_URL: action.payload}

    case EditorConfigReducer.listUrl:
      return {...editor, LIST_URL: action.payload}
  
    case EditorConfigReducer.newUrl:
      return {...editor, NEW_URL: action.payload}

    case EditorConfigReducer.postUrl:
      return {...editor, POST_URL: action.payload}
 
    case EditorConfigReducer.excelUrl:
      return {...editor, EXCEL_URL: action.payload}

    case EditorConfigReducer.list:
      return {...editor, list: action.payload}
      
    case EditorConfigReducer.editors:
      return {...editor, editors: action.payload}

    case EditorConfigReducer.entities:
      return {...editor, entities: action.payload}
  
    case EditorConfigReducer.load:
      return {...editor, load: action.payload}      

    default:
      throw new Error()
  }
}




