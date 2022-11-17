import { FC, useContext } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import { isCreate, isRead, isUpdate } from '../../system/Permission' 
import useLabel from '../../lang/useLabel'
import LabelDialog from '../../lang/LabelDialog'
import ButtonM from '@mui/material/Button';

interface Props {
  langkey : string,
  onClick : any,
  disabled? : boolean
  className? : string
  type? : 'button' | 'save' | 'new' | 'submit' | 'reset'
  permission? : string
}

const Button : FC<Props> = ({ 
      langkey, 
      onClick, 
      disabled = false, 
      className = '', 
      type = 'button',
      permission
    }) => {
  
  const { session } = useContext(AppContext) as AppContextI

  var saveB = type === 'save'
  var newB = type === 'new'

  if (type === 'save') type = 'button'
  if (type === 'new') type = 'button'
  
  const typeX = () : string => {
    if (type === 'save') return 'button'
    if (type === 'new') return 'button'
    return type
  }

  const disabledX = () : boolean => {
    if (disabled) return true
    if (typeof permission === 'undefined') return false
    if (saveB && !isUpdate(session, permission)) return true
    if (newB && !isCreate(session, permission)) return true
    return false
  }

  return (
    <ButtonM 
      variant='contained'
      onClick={onClick} 
      disabled={disabledX()} 
      className={className}
      type={type}
    >
      {useLabel(langkey)}
      {session.editLabels && <LabelDialog langkey={langkey} />}
    </ButtonM>
  );
  
}

export default Button