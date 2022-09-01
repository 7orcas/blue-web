import { FC } from 'react'
import { useContext } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import useLabel from './useLabel'
import LabelDialog from '../lang/LabelDialog'

interface Props {
  langkey : string
}

const LangLabel : FC<Props> = ({langkey}) => {

  const { session } = useContext(AppContext) as AppContextI

  return (
    <>
      {useLabel(langkey)}
      {session.editLabels && <LabelDialog langkey={langkey} />}
    </>
  )
}

export default LangLabel
