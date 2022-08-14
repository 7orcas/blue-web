import UrlSearchParams from '../api/urlSearchParams'
import { LabelI } from '../lang/loadLabels'

/*
 Convience class to store session variables
 
 [Licence]
 @author John Stewart
 */

class Session {
  params : UrlSearchParams = new UrlSearchParams()
  baseUrl : string = ''
  org : number = 0
  labels : LabelI[] = []
  debugMessage: string = ''
  

  /*
   Deep copy
   But functions need to be manually copied
   */
  copy = () : Session => {
    var x : Session = JSON.parse(JSON.stringify(this));
    x.copy = this.copy
    return x;
  }


}

export default Session
