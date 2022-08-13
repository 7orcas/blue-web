import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/context/AppContext'

const Test2 = () => {

  const { debugMessage } = useContext(AppContext) as AppContextI

  return (
    <section >
      {debugMessage}
    </section>
  )
}

export default Test2
