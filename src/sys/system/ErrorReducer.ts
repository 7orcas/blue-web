import Error, { ErrorType } from './Error'

/*
  Error state object reducer

  [Licence]
  @author John Stewart
 */


const reducer = (error : Error, action : any) => {
  switch (action.type) {

    case ErrorType.message:
      return {...error, message: action.payload};

    default:
      throw new Error();
  }
}

export default reducer