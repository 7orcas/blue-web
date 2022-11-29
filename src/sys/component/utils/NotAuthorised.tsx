import { useContext, useEffect } from 'react'
import LangLabel from '../../lang/LangLabel'
import AppContext, { AppContextI } from '../../system/AppContext'
import { SessionField } from '../../system/Session'

/*
  User is not authorised using the last link

  [Licence]
  Created 29.11.22
  @author John Stewart
 */

const NotAuthorised = () => {

  const { setSession, setTitle } = useContext(AppContext) as AppContextI

  //Initial load 
  useEffect(() => {
    setTitle('notauth')
    setSession ({ type: SessionField.notAuthorised, payload: false })
  },[])


  return (
    <div className='main-body'>
      <div className=''><LangLabel langkey='notauth1' /></div>
      <div className=''><LangLabel langkey='seeadmin' /></div>
    </div>
  )
}

export default NotAuthorised
