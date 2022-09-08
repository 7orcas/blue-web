
/*
 Convience class to store messages to users (via dialogs)
 
 [Licence]
 @author John Stewart
 */

export enum MessageType {
  none,
  error,
  warn,
  message,
  detail
}

export enum MessageReducer {
  type,
  message,
  context,
  detail,
}

class Message {
  type : MessageType = MessageType.message
  message : string = ''
  context : string = ''
  detail : string = ''
}

export default Message
