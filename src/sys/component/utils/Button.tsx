import { FC, useContext } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import useLabel from '../../lang/useLabel'
import LabelDialog from '../../lang/LabelDialog'
import ButtonM from '@mui/material/Button';

interface Props {
  langkey : string,
  onClick : any,
  disabled? : boolean
  className? : string
  type? : 'button' | 'submit' | 'reset' | undefined
}

const Button : FC<Props> = ({ langkey, onClick, disabled = false, className = '', type }) => {
  
  const { session } = useContext(AppContext) as AppContextI

  return (
    <ButtonM 
      variant='contained'
      onClick={onClick} 
      disabled={disabled} 
      className={className}
      type={type}
    >
      {useLabel(langkey)}
      {session.editLabels && <LabelDialog langkey={langkey} />}
    </ButtonM>
  );
  
}

export default Button