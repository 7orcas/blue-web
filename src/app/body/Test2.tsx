import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/context/AppContext'

const Test2 = () => {

  const { session } = useContext(AppContext) as AppContextI

  return (
    <section >
      <p>Test2</p>
      {session.debugMessage}
    </section>
  )
}

export default Test2
