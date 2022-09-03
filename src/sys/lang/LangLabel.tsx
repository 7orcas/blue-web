import { FC } from 'react'
import { useContext } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import useLabel from './useLabel'
import LabelDialog from '../lang/LabelDialog'

interface Props {
  langkey : string
  className? : string
}

const LangLabel : FC<Props> = ({ langkey, className = '' }) => {

  const { session } = useContext(AppContext) as AppContextI

  return (
    <span className={className} style={{display:'inline-flex'}}>
      {useLabel(langkey)}
      {session.editLabels && <LabelDialog langkey={langkey} />}
    </span>
  )
}

export default LangLabel
