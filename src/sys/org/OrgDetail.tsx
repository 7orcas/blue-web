import { useContext, useEffect, FC, useCallback } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { useLabel, loadConfiguration, closeEditor, formatTs, maxLengthText } from '../component/editor/editorUtil'
import { CONFIG, OrgEntI } from './org'
import { EditorConfig, EditorConfigField as ECF } from '../component/editor/EditorConfig'
import { BaseEntI } from '../definition/interfaces'
import TableMenu,  { TableMenuTab } from '../component/table/TableMenu'
import ButtonClose from '../component/utils/ButtonClose'
import LangLabel from '../lang/LangLabel';
import TextField from '../component/utils/TextField'
import EntityInfo from '../component/utils/EntityInfo'
import Accordion from '../component/utils/Accordion'

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
  editable : boolean
}
  
const OrgDetail : FC<Props> = ({ 
      editorConfig,
      setEditorConfig,
      id, 
      entity, 
      updateEntity,
      editable
    }) => {
        
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

  return (
    <div className='editor'>
      <div className='menu-header'>
        <TableMenuTab
          code={entity.code}
          close={close}
        />
      </div>
      <div key={id} className='editor-detail'>
        <>
          <EntityInfo
            entity={entity}
          />
          <div className='editor-block'>
            <TextField
              type='number'
              label='orgnr-s'
              inputProps={{ maxLength: 5 }}
              entity={entity}
              field='orgNr'
              updateEntity={updateEntity}
              required={true}
              readonly={entity.id > 0}
            />
            <TextField
              label='code'
              inputProps={{ maxLength: maxLength('code') }}
              entity={entity}
              field='code'
              updateEntity={updateEntity}
              required={true}
            />
          </div>

          <div className='editor-block'>
          <Accordion
            langkey='login'
          >
            <TextField
              type='number'
              label='maxLAttemp'
              inputProps={{ maxLength: 5 }}
              entity={entity}
              field='maxLoginAttempts'
              updateEntity={updateEntity}
              required={true}
            />
          </Accordion>
          </div>


          

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
        
      </div>
    </div>
  )
}

export default OrgDetail
