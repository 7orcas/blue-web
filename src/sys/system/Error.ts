
/*
 Convience class to store error messages
 
 [Licence]
 @author John Stewart
 */

export enum ErrorType {
  error,
  warn,
  message,
  detail
}

export enum ErrorReducer {
  type,
  message,
  context,
  detail,
}

class Error {
  type : ErrorType = ErrorType.message
  message : string = ''
  context : string = ''
  detail : string = ''
}

export default Error
