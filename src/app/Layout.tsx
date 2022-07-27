import React, { useContext } from 'react'
import AppContext, { AppContextI } from '../sys/AppContext'
import useLabel from '../sys/util/useLabel'


const Layout = () => {

  const { loadLang, labels } = useContext(AppContext) as AppContextI
  
  return (
    <>
      <header>
        <h1>Blue</h1>
      </header>
      <form onSubmit={(e) => e.preventDefault()}>
        LANG PACK
        <button type="submit" onClick={() => loadLang()}>Lang</button>
      </form>
      <div>
        <h1>
          <a href='http://localhost:3000/'>{useLabel('login')}</a>
        </h1>
      </div>
      userid={useLabel('userid')}
    </>
  )
}

export default Layout
