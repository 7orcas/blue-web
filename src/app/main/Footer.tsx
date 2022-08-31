import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'

const Footer = () => {

  const { session, error } = useContext(AppContext) as AppContextI

  return (
    <section className='main-footer'>
      {session.debugMessage}
      {error.message}
    </section>
  )
}

export default Footer
