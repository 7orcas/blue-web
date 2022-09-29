
/*
 Store messages to users (via dialogs)
 When changed useEffect hook will display in dialog
 
 Created Aug '22
 [Licence]
 @author John Stewart
 */

export enum MessageType {
  none,
  error,
  warn,
  message,
  detail,
  unsaved
}

class Message {
  type : MessageType = MessageType.message
  message : string = ''
  context : string = ''
  detail : string = ''
  transition : any = undefined  //used in unsaved dialog (usePrompt hook)
}

export default Message
