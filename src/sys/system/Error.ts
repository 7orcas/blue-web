
/*
 Convience class to store error messages
 
 [Licence]
 @author John Stewart
 */

//Used in the dispatch and reducer functions
export enum ErrorType {
  message,
}

class Error {
  message : string = ''
}

export default Error
