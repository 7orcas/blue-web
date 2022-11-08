import { FC } from 'react'
import { useLabel } from '../editor/editorUtil'

interface Props {
  langkey? : string,
  message? : string
}

const Loading : FC<Props> = ({ langkey = '', message = '' }) => {

  return (
    <div className='loading-message'>
      {useLabel('loading') + useLabel(langkey)+ message }
    </div>
  )
  
}

export default Loading