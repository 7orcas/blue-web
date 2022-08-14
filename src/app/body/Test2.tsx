import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/context/AppContext'

const Test2 = () => {

  const { session, debugMessage } = useContext(AppContext) as AppContextI

  return (
    <section >
      {session.debugMessage}
    </section>
  )
}

export default Test2
