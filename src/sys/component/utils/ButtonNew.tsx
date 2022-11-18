import { FC, useContext } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import { isCreate } from '../../system/Permission' 
import Button from './Button';

/*
  New Record Button
  Checks session permission to validate it being enabled

  [Licence]
  Created 01.11.22
  @author John Stewart
 */
interface Props {
  langkey? : string,
  onClick : any,
  disabled? : boolean
  className? : string
  permission? : string
}

const ButtonSave : FC<Props> = ({ 
      langkey = 'new', 
      onClick, 
      disabled = false, 
      className = '', 
      permission
    }) => {
  
  const { session } = useContext(AppContext) as AppContextI

  const permssionX = () => {
    if (typeof permission !== 'undefined') return permission
    return session.permission
  }

  const disabledX = () : boolean => {
    if (disabled) return true
    var p = permssionX()
    if (p !== null && !isCreate(session, p)) return true
    return false
  }

  return (
    <Button 
      langkey={langkey}
      onClick={onClick} 
      disabled={disabledX()} 
      className={className}
      type='button'
    />
  );
  
}

export default ButtonSave