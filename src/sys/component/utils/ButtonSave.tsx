import { FC, useContext } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import { isUpdate } from '../../system/Permission' 
import Button from './Button';

/*
  Save (Update) changes button
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
      langkey = 'save', 
      onClick, 
      disabled = false, 
      className = 'table-menu-item', 
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
    if (p !== null && !isUpdate(session, p)) return true
    if (session.changed) return false
    return true
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