import Error, { ErrorReducer } from './Error'

/*
  Error state object reducer

  [Licence]
  @author John Stewart
 */


const reducer = (error : Error, action : any) => {
  switch (action.type) {

    case ErrorReducer.message:
      return {...error, message: action.payload};

    case ErrorReducer.context:
      return {...error, context: action.payload};

    case ErrorReducer.detail:
      return {...error, detail: action.payload};
  
    case ErrorReducer.type:
      return {...error, type: action.payload};
  
    default:
      throw new Error();
  }
}

export default reducer