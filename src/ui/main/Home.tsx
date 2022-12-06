import { useContext, useEffect } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'

/*
  Home page

  [Licence]
  Created 15.11.22
  @author John Stewart
 */

const Home = () => {

  const { setTitle } = useContext(AppContext) as AppContextI

  //Initial load 
  useEffect(() => {
    setTitle('appname')
  },[])


  return (
    <div className='main-body'>
    </div>
  )
}

export default Home
