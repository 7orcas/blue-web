import { FC, useContext } from 'react'
import AppContext, { AppContextI } from '../context/AppContext'
import useLabel from '../lang/useLabel'
import LabelDialog from '../lang/LabelDialog'
import Button from '@mui/material/Button';

interface Props {
  langkey : string,
  onClick : any,
}

const ButtonX : FC<Props> = ({ langkey, onClick }) => {
  
  const { session } = useContext(AppContext) as AppContextI

  return (
    <Button variant="outlined" onClick={onClick}>
      {useLabel(langkey)}
      {session.editLabels && <LabelDialog langkey={langkey} />}
    </Button>
  );
  
}

export default ButtonX