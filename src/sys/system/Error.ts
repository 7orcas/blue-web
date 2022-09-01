
/*
 Convience class to store error messages
 
 [Licence]
 @author John Stewart
 */

export enum ErrorType {
  error,
  warn,
  message
}

export enum ErrorReducer {
  type,
  message,
  context,
}

class Error {
  type : ErrorType = ErrorType.message
  message : string = ''
  context : string = ''
}

export default Error
