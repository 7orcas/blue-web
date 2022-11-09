import { useContext, FC } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import { BaseEntI } from '../../definition/interfaces'
import { useLabel, formatTs } from '../editor/editorUtil'

/*
  Display record info

  [Licence]
  Created 09.11.22
  @author John Stewart
 */

interface Props {
  entity : BaseEntI
}
  
const EntityInfo : FC<Props> = ({ 
      entity
    }) => {
  
  const { session } = useContext(AppContext) as AppContextI
  
  // const showId = () => {
  //   return useLabel('lastup') + entity.id + ' '
  // }

  return (
    <div className='editor-info-line'>
      {session.devAdmin && 'id:' + entity.id + '  '}
      {useLabel('lastup')}: {formatTs(entity.updated)}
    </div>
  )
}

export default EntityInfo