import { FC } from 'react'
import { useContext } from 'react'
import AppContext, { AppContextI } from '../context/AppContext'
import useLabel from './useLabel'

interface Props {
  langkey : string
}

const LangLabel : FC<Props> = ({langkey}) => {

  const { session } = useContext(AppContext) as AppContextI

  return (
    <>
      {useLabel(langkey)}
      {session.editLabels && <span>*</span>}
    </>
  )
}

export default LangLabel
