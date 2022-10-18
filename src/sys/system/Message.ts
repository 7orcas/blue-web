import { BaseEntI } from "../definition/interfaces"

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
  commitError,
  unsaved
}

export interface CommitErrorI extends BaseEntI {
  entityId: number 
  action: string
  updated: string
	updatedUser: string
}

class Message {
  type : MessageType = MessageType.message
  message : string = ''
  context : string = ''
  detail : string = ''
  transition : any = undefined  //used in unsaved dialog (usePrompt hook)
  commitErrors : Array<CommitErrorI> = []  
}

export default Message
