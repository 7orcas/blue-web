import './user.css'
import { useContext, useState, useEffect } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { useNavigate } from 'react-router-dom';
import apiPut from '../api/apiPut'
import Message, { MessageType } from '../system/Message'
import { JsonResponseI } from '../definition/types';
import TableMenu from '../component/table/TableMenu'
import Button from '../component/utils/Button'
import TextField from '../component/utils/TextField'
import Loading from '../component/utils/Loading'
/*
  Change Password

  [Licence]
  Created 15.11.22
  @author John Stewart
 */

interface ChangePWI {
  passcurr: string
  passnew: string
  passconf: string
}  

const ChangePW = () => {

  const { setTitle, setMessage } = useContext(AppContext) as AppContextI

  //Initial load 
  useEffect(() => {
    setTitle('passchg')
  },[])

  var entityX : ChangePWI = {
    passcurr:'',
    passnew:'',
    passconf:''
  }

  const [entity, setEntity] = useState(entityX)
  const [valid, setValid] = useState(false)
  const [showPw, setShowPw] = useState(false)
  
  const navigate = useNavigate();

  const fields = () => {
    var array = []
    array.push('passcurr')
    array.push('passnew')
    array.push('passconf')
    return array
  }
  
  const showText = () => {
    setShowPw(!showPw)
  }

  const updateEntity = (ent : ChangePWI) => {
    setEntity(ent)
    setValid(isValid(ent))
  }

  //Commit password change
  const handleCommit = () => {
    const put = async () => {
      var data = await apiPut('user/changePW', entity, setMessage)

      var m = new Message()

      if (data.data.result === JsonResponseI.ok) {
        m.type = MessageType.message
        const timer = setTimeout(() =>  {
          navigate('/')
        }, 500)
        return () => clearTimeout(timer)   
      }
      else {
        m.type = MessageType.warn
      }

      m.message = data.data.message
      setMessage(m)
    }
    put()
  }

  const isValid = (ent : ChangePWI) => {
    if (ent.passcurr.length === 0) return false
    if (ent.passnew.length === 0) return false
    if (ent.passconf.length === 0) return false
    if (ent.passnew !== ent.passconf) return false
    return true
  }

  return (
    <div >
      <div className='editor'>
        <div className='editor-detail editor-no-border'>
          <div className='menu-header'>
            <TableMenu>
              <Button onClick={handleCommit} langkey='commit' className='table-menu-item' disabled={!valid}/>
              <Button onClick={showText} langkey={showPw?'passhide':'passshow'} className='table-menu-item'/>
            </TableMenu>
          </div>
          <div className='editor-block'>
            {fields().map((field : string, id : number) => {
              return(
              field !== undefined ?
              <div key={id}>
                <TextField
                  field={field}
                  type={showPw?'text':'password'}
                  className='text-field password-field'
                  entity={entity}
                  updateEntity={updateEntity}
                  inputProps={{ maxLength: 50 }}
                  required={true}
                  changeOnBlur={false}
                />
              </div>
              : <div key={id}>
              <Loading/>
            </div>
              )}
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


export default ChangePW