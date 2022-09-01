import { FC, useContext } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import useLabel from '../lang/useLabel'
import LabelDialog from '../lang/LabelDialog'
import ButtonM from '@mui/material/Button';

interface Props {
  langkey : string,
  onClick : any,
  disabled? : boolean
}

const Button : FC<Props> = ({ langkey, onClick, disabled }) => {
  
  const { session } = useContext(AppContext) as AppContextI

  return (
    <ButtonM variant="outlined" onClick={onClick} disabled={disabled}>
      {useLabel(langkey)}
      {session.editLabels && <LabelDialog langkey={langkey} />}
    </ButtonM>
  );
  
}

export default Button