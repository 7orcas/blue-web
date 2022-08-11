import React, { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/AppContext'
import loadLabels from '../../sys/lang/loadLabels'
import useLabel from '../../sys/lang/useLabel'
import UrlSearchParams from '../../sys/api/urlSearchParams'

const Body = () => {

  const { baseUrl, setLabels } = useContext(AppContext) as AppContextI
  const params = new UrlSearchParams()

  return (
    <div className='main-body'>
      <form onSubmit={(e) => e.preventDefault()}>
        LANG PACK
        <button type="submit" onClick={() => loadLabels(baseUrl, setLabels)}>Lang</button>
      </form>
      <div>
        <h1>
          <a href='http://localhost:8080/blue-web-login/?u=js@7orcas.com&p=123&org=t'>{useLabel('login')}</a>
        </h1>
      </div>
      <p>Base Url: {params.baseUrl + baseUrl}</p>
      <p>Initialise Url: {params.init}</p>
      <p>Session ID: {params.sid}</p>

      userid={useLabel('userid')}
    </div>
  )
}

export default Body
