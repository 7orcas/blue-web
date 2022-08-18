import UrlSearchParams from '../api/urlSearchParams'
import { LabelI } from '../lang/loadLabels'

/*
 Convience class to store session variables
 
 [Licence]
 @author John Stewart
 */

//Used in the dispatch and reducer functions
export enum SessionType {
  userid,
  params,
  baseUrl,
  org,
  lang,
  loadLabels,
  editLabels,
  roles,
  debugMessage,
  tgTheme,
}


class Session {
  userid : string = ''
  params : UrlSearchParams = new UrlSearchParams()
  baseUrl : string = ''
  org : number = 0
  lang : string = ''
  labels : LabelI[] = []
  editLabels : boolean = true
  roles : string[] = []
  debugMessage: string = ''
  theme : string = 'dark'
}

export default Session
