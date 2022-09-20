import Message, { MessageReducer } from './Message'

/*
  Message state object reducer

  [Licence]
  @author John Stewart
 */


const reducer = (message : Message, action : any) => {
  switch (action.type) {

    case MessageReducer.message:
      return {...message, message: action.payload};

    case MessageReducer.context:
      return {...message, context: action.payload};

    case MessageReducer.detail:
      return {...message, detail: action.payload};
  
    case MessageReducer.type:
      return {...message, type: action.payload};
  
    case MessageReducer.transition:
      return {...message, transition: action.payload};
    
    default:
      throw new Message();
  }
}

export default reducer