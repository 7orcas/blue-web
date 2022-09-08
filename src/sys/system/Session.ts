import UrlSearchParams from '../api/urlSearchParams'
import { LabelI } from '../lang/loadLabels'

/*
 Convience class to store session variables
 
 [Licence]
 @author John Stewart
 */

//Used in the setSession and reducer functions
export enum SessionReducer {
  loggedIn,
  userid,
  params,
  orgNr,
  lang,
  labels,
  editLabels,
  roles,
  debugMessage,
  tgTheme,
  messageDialog,
}

export enum ThemeType {
  light,
  dark,
}


class Session {
  loggedIn : boolean = true
  userid : string = ''
  params : UrlSearchParams = new UrlSearchParams()
  orgNr : number = 0
  lang : string = ''
  labels : LabelI[] = []
  editLabels : boolean = false
  roles : string[] = []
  debugMessage: string = ''
  theme : ThemeType = ThemeType.dark
  messageDialog : string = ''
}

export default Session
