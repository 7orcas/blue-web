import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/context/AppContext'
import { SessionType } from '../../sys/context/Session'
import loadLabels from '../../sys/lang/loadLabels'
import useLabel from '../../sys/lang/useLabel'

const Test1 = () => {

  const { session, dispatch } = useContext(AppContext) as AppContextI
  
  const loadLabelsX = async() => {
    var l = await loadLabels(session.baseUrl)
    if (l !== null) {
      dispatch ({type: SessionType.loadLabels, payload: l})
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
      <p>Base Url: {session.params.baseUrl + session.baseUrl}</p>
      <p>Initialise Url: {session.params.init}</p>
      <p>Session ID: {session.params.sid}</p>
      <p>Lang: {session.lang}</p>
      <p>Roles: {session.roles.map(r => r + ' ')}</p>
    </div>
  )
}

export default Test1
