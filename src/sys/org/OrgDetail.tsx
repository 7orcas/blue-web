import { useContext, useEffect, FC, useCallback } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { loadConfiguration, closeEditor, formatTs, maxLengthText } from '../component/editor/editorUtil'
import { CONFIG, OrgEntI } from './org'
import { EditorConfig, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { BaseEntI } from '../definition/interfaces'
import TableMenu from '../component/table/TableMenu'
import ButtonClose from '../component/utils/ButtonClose'
import LangLabel from '../lang/LangLabel';
import { Checkbox } from '@mui/material'
import TextField from '../component/utils/TextField'

/*
  Show organisational detail

  [Licence]
  Created 13.09.22
  @author John Stewart
*/

interface Props {
  editorConfig : EditorConfig<BaseEntI, BaseEntI>
  setEditorConfig : any
  id : number
  entity : OrgEntI
  updateEntity : any
}
  
const OrgDetail : FC<Props> = ({ 
      editorConfig,
      setEditorConfig,
      id, 
      entity, 
      updateEntity}) => {
        
  const { session, setSession, setMessage, configs, setConfigs } = useContext(AppContext) as AppContextI
        
  //Load entity configurations
  const loadConfigurationX = useCallback(() => {
    return loadConfiguration(
      editorConfig,
      configs,
      setConfigs,
      setSession,
      setMessage)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []
  )

  //Initial load 
  useEffect(() => {
    loadConfigurationX()
  },[loadConfigurationX])

  //Text field lengths
  const config = configs.get(CONFIG)
  const maxLength = (field : string) => {
    return maxLengthText(config, field)
  }

  //Close this editor
  const close = () => {
    closeEditor(editorConfig, setEditorConfig, id)
  }

  const title = () => {
    if (typeof entity !== 'undefined') {
      return entity.code
    }
    return '?'
  }

  return (
    <div className='editor'>
      <div className='menu-header'>
        <TableMenu>
          <div className='table-menu-item table-menu-label'>{entity.code}</div>
          <ButtonClose onClick={close} className='table-menu-right' />
        </TableMenu>
      </div>
      <div key={id} className='editor-detail'>
        {typeof entity !== 'undefined' &&
        <>
          <p>id:{entity.id} updated:{formatTs(entity.updated)}</p>
          <TextField
            type='number'
            label='orgnr-s'
            inputProps={{ maxLength: 5 }}
            entity={entity}
            field='orgNr'
            updateEntity={updateEntity}
            required={true}
            theme={session.theme}
            readonly={entity.id > 0}
          />
          <TextField
            label='code'
            inputProps={{ maxLength: maxLength('code') }}
            entity={entity}
            field='code'
            updateEntity={updateEntity}
            required={true}
            theme={session.theme}
          />
            {/* <div> 
              <LangLabel langkey='dvalue'/>
              <Checkbox
                name='dvalue'
                checked={entity.dvalue}
                onChange={handleChange}
              />
            </div>
            <div> 
              <LangLabel langkey='delete'/>
              <Checkbox
                name='delete'
                checked={entity.delete}
                onChange={handleChange}
              />
            </div> */}
          </>
        }
      </div>
    </div>
  )
}

export default OrgDetail
