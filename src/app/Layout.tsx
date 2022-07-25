import React, { useContext } from 'react'
import AppContext, { AppContextI } from '../sys/AppContext'

const Layout = () => {

  const { lang } = useContext(AppContext) as AppContextI
  
  return (
    <>
      <header>
        <h1>Blue</h1>
      </header>
      <form onSubmit={(e) => e.preventDefault()}>
        LANG PACK
        <button type="submit" onClick={() => lang()}>Lang</button>
      </form>
      <div>
        <h1>
          <a href='http://localhost:3000/'>Login</a>
        </h1>
      </div>
    </>
  )
}

export default Layout
