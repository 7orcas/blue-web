import axios from './apiAxios'

/*
  User Configuration POST method to the server

  [Licence]
  Created 10.11.22
  @author John Stewart
 */
const apiPut = (
      config : string, 
      value : string, 
      ) => {

  try {
    var x = {config: config, value : value}
    axios.put('user/put/config', x)
  } catch (err : any) {
    console.log ('Error in apiPut:' + err)
  } 
}

export default apiPut