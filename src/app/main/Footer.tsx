import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import MessageDialog from '../../sys/utils/MessageDialog'
import useLabel from '../../sys/lang/useLabel'

const Footer = () => {

  const { session, message } = useContext(AppContext) as AppContextI
 
  return (
    <>
      <section className='main-footer'>
        {session.debugMessage + ', '}
        {useLabel(message.message)}
      </section>
      <MessageDialog />
    </>
  )
}

export default Footer
