import Config, { ConfigReducer } from './ConfigDEL'

/*
  Message state object reducer

  [Licence]
  @author John Stewart
 */


const reducer = (config : Config, action : any) => {
  switch (action.type) {

    case ConfigReducer.entity:
      return {...config, configs: action.payload};

    default:
      throw new Error();
  }
}

export default reducer