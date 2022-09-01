/*
  User class tfor re-logging in

  [Licence]
  Created 1/9/22
  @author John Stewart
 */

class User {
  userid : string = ''
  pw : string = ''
  
  constructor(u : User | null) {
    if (u !== null) {
      this.update (u)
    }
  }

  update = (u : User) => {
    this.userid = u.userid
    this.pw = u.pw
  }

  isValid = () => {
    if (!this.isValidTest(this.userid)) return false
    if (!this.isValidTest(this.pw)) return false
    return true
  }

  isValidTest (field : string ) {
    return typeof field !== 'undefined'
      && field.length > 0
  }
}

export default User
