import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/context/AppContext'

const Footer = () => {

  const { debugMessage } = useContext(AppContext) as AppContextI

  return (
    <section className='main-footer'>
      {debugMessage}
    </section>
  )
}

export default Footer
