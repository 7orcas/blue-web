import { BaseI, BaseListI, BaseEntI } from '../../definition/interfaces'

/*
 Class to store editor variables
 
 Created 30.09.22
 [Licence]
 @author John Stewart
 */

//Used in the setEditorConfig and reducer functions
export enum EditorConfigType {
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


  //Return object from list by it's id
  getObjectById (id : number, list : BaseI[]) {
    for (var i=0;i<list.length;i++){
      if (list[i].id === id) {
        return list[i]
      }
    }
    return null;
  }


}

//EditorConfig state object reducer
export const editorConfigReducer = <L extends BaseListI, E extends BaseEntI>(editor : EditorConfig<L,E>, action : any) => {
  switch (action.type) {

    case EditorConfigType.configEntities:
      return {...editor, CONFIG_ENTITIES: action.payload}

    case EditorConfigType.configUrl:
      return {...editor, CONFIG_URL: action.payload}

    case EditorConfigType.listUrl:
      return {...editor, LIST_URL: action.payload}
  
    case EditorConfigType.newUrl:
      return {...editor, NEW_URL: action.payload}

    case EditorConfigType.postUrl:
      return {...editor, POST_URL: action.payload}
 
    case EditorConfigType.excelUrl:
      return {...editor, EXCEL_URL: action.payload}

    case EditorConfigType.list:
      return {...editor, list: action.payload}
      
    case EditorConfigType.editors:
      return {...editor, editors: action.payload}

    case EditorConfigType.entities:
      return {...editor, entities: action.payload}
  
    case EditorConfigType.load:
      return {...editor, load: action.payload}      

    default:
      throw new Error()
  }
}




