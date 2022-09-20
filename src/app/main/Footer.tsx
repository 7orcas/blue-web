import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import MessageDialog from '../../sys/component/dialog/MessageDialog'
import UnsavedDialog from '../../sys/component/dialog/UnsavedDialog'
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
      <UnsavedDialog />
    </>
  )
}

export default Footer
