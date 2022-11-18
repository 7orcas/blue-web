import { FC } from 'react'
import ButtonM from '@mui/material/Button';

/*
  Close editor button

  [Licence]
  Created 01.11.22
  @author John Stewart
 */
interface Props {
  onClick : any,
  disabled? : boolean
  className? : string
  type? : 'button' | 'submit' | 'reset' | undefined
}

const ButtonClose : FC<Props> = ({ onClick, disabled = false, className = '', type }) => {
  
  return (
    <ButtonM 
      variant='contained'
      onClick={onClick} 
      disabled={disabled} 
      className={className}
      type={type}
      style={{
        borderColor: '#ad3b3b',
        backgroundColor: '#ad3b3b',
        fontWeight: 'bold',
        maxWidth: '5px', 
        maxHeight: '30px', 
        minWidth: '5px', 
        minHeight: '30px'}}
    >
      X
    </ButtonM>
  );
  
}

export default ButtonClose