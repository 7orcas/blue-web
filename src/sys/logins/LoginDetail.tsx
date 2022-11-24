import { useContext } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import TextField from '../component/utils/TextField'
import TableMenu from '../component/table/TableMenu'

/*
  Show current login detail

  [Licence]
  Created 24.11.22
  @author John Stewart
*/
 
const LoginDetail = () => {
        
  const { session } = useContext(AppContext) as AppContextI

  const style={ width: '500px' }

  return (
    <div className='editor'>
      <div className='menu-header-spacer'/>
      <div className='editor-detail editor-no-border'>
        <TextField
          entity={session.params}
          field='baseUrl'
          readonly={true}
          style={style}
        />
        <TextField
          entity={session.params}
          field='sid'
          readonly={true}
          style={style}
        />
      </div>
    </div>
  )
}

export default LoginDetail
