import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/context/AppContext'
import loadLabels from '../../sys/lang/loadLabels'
import useLabel from '../../sys/lang/useLabel'

const Test1 = () => {

  const { session, setSession } = useContext(AppContext) as AppContextI
  
  const loadLabelsX = async() => {
    var l = await loadLabels(session.baseUrl)
    var s = session.copy()
    s.labels = l!
    setSession(s)
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
      <p>Base Url: {session.params.baseUrl + session.baseUrl}</p>
      <p>Initialise Url: {session.params.init}</p>
      <p>Session ID: {session.params.sid}</p>

      userid={useLabel('userid')}
    </div>
  )
}

export default Test1
