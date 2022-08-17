import UrlSearchParams from '../api/urlSearchParams'
import { LabelI } from '../lang/loadLabels'

/*
 Convience class to store session variables
 
 [Licence]
 @author John Stewart
 */

//Used in the dispatch and reducer functions
export enum SessionType {
  params,
  baseUrl,
  org,
  loadLabels,
  debugMessage,
  tgTheme,
}


class Session {
  params : UrlSearchParams = new UrlSearchParams()
  baseUrl : string = ''
  org : number = 0
  labels : LabelI[] = []
  debugMessage: string = ''
  theme : string = 'dark'
  

  // /* DELETE
  //  Deep copy
  //  But functions need to be manually copied
  //  */
  // copy = () : Session => {
  //   var x : Session = JSON.parse(JSON.stringify(this));
  //   x.copy = this.copy
  //   return x;
  // }

}

export default Session
