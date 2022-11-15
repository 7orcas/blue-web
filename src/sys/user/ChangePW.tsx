import './user.css'
import { useContext, useState } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import TextField from '../component/utils/TextField'

/*
  Change Password

  [Licence]
  Created 15.11.22
  @author John Stewart
 */

const ChangePW = () => {

  const { setTitle } = useContext(AppContext) as AppContextI

  setTitle('passchg')

  var entity = {
    pwCurrent:'',
    pwNew:'',
    pwConfirm:''
  }

  const [pw, setPw] = useState(entity)
  
  //Commit password change
  const handleCommit = () => {
    
  }

  const isValid = () => {
    return true
  }

  return (
    <div >
      <div className='editor'>
        <div className='editor-detail'>
          <TableMenu>
            <Button onClick={handleCommit} langkey='commit' className='table-menu-item' disabled={!isValid}/>
          </TableMenu>
          <div className='editor-block'>
            <TextField
              field='pwCurrent'
              entity={entity}
              inputProps={{ maxLength: 50 }}
              required={true}
            />
            <TextField
              field='pwNew'
              entity={entity}
              inputProps={{ maxLength: 50 }}
              required={true}
            />
            <TextField
              field='pwConfirm'
              entity={entity}
              inputProps={{ maxLength: 50 }}
              required={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


export default ChangePW