import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/context/AppContext'

const Footer = () => {

  const { session } = useContext(AppContext) as AppContextI

  return (
    <section className='main-footer'>
      {session.debugMessage}
    </section>
  )
}

export default Footer
