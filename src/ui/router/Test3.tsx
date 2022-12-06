import { useContext } from 'react'
import AppContext, { AppContextI } from '../../sys/system/AppContext'

export default function Test3 () {

  const { session } = useContext(AppContext) as AppContextI

  return (
    <section >
      <p>Test3</p>
      {session.debugMessage}
    </section>
  )
}

