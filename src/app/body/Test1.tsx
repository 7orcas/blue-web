import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import { SessionField } from '../../sys/system/Session'
import loadLabels from '../../sys/lang/loadLabels'
import useLabel from '../../sys/lang/useLabel'

const Test1 = () => {

  const { session, setSession, setMessage } = useContext(AppContext) as AppContextI
  
  const loadLabelsX = async() => {
    var l = await loadLabels('', setMessage, setSession)
    if (l !== null) {
      setSession ({type: SessionField.labels, payload: l})
    }
  }

  return (
    <div className='main-body'>
      <form onSubmit={(e) => e.preventDefault()}>
        LANG PACK
        <button type="submit" onClick={() => loadLabelsX()}>Lang</button>
      </form>
      <div>
        <h1>
          <a href='http://localhost:8080/blue-web-login/?u=js@7orcas.com&p=123&org=t'>{useLabel('login')}</a>
        </h1>
      </div>
      <p>Userid: {session.userid}</p>
      <p>Org: {session.orgNr}</p>
      <p>Base Url: {session.params.baseUrl}</p>
      <p>Initialise Url: {session.params.init}</p>
      <p>Session ID: {session.params.sid}</p>
      <p>Lang: {session.lang}</p>
      {/* <p>Permissions: 
        {session.permissions.forEach((v:string,k:string) => {return (k + '=' + v)})
      }</p> */}
    </div>
  )
}

export default Test1
