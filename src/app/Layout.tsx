import React, { useContext } from 'react'
import AppContext, { AppContextI } from '../sys/AppContext'
import useLabel from '../sys/util/useLabel'
import loadLabels from '../sys/util/loadLabels'
import UrlSearchParams from '../sys/util/urlSearchParams'

const Layout = () => {

  const { baseUrl, setLabels } = useContext(AppContext) as AppContextI
  const params = new UrlSearchParams()

  return (
    <>
      <header>
        <h1>Blue</h1>
      </header>
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
    </>
  )
}

export default Layout
