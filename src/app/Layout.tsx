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
        <a href='http://localhost:3000/'>Login</a>
      </div>
    </>
  )
}

export default Layout
