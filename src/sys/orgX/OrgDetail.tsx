import { useContext, useEffect, useMemo, FC, useCallback } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { loadConfiguration, useLabel, onListSelectionSetEditors, getObjectById } from '../component/editor/editorUtil'
import { OrgListI, OrgEntI } from './org'
import { EditorConfig, EditorConfigType } from '../component/editor/EditorConfig'
import { ConfigI, ConfigFieldI } from '../definition/interfaces';
import { BaseListI, BaseEntI } from '../definition/interfaces'
import LangLabel from '../lang/LangLabel';
import { Checkbox, FormControl } from '@mui/material'
import TextField from '../component/utils/TextField'

/*
  Show organisational detail

  [Licence]
  Created 13.09.22
  @author John Stewart
*/

interface Props <L extends BaseListI, E extends BaseEntI> {
  editorConfig : EditorConfig<BaseListI, BaseEntI>
  setEditorConfig : any
  id : number
  entity : OrgEntI
  updateEntity : any
}
  
const OrgDetail : FC<Props<OrgListI, OrgEntI>> = ({ 
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


  const handleChangeActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    entity.active = event.target.checked;
    updateEntity(id, entity)
  };
 
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setValue(event.target.value)
    if (typeof entity !== 'undefined'){
      const { name } = event.target;
      switch (name) {
        case 'delete': entity.delete = event.target.checked; break
        case 'dvalue': entity.dvalue = event.target.checked; break
        case 'code': entity.code = event.target.value; break
      }
      updateEntity(id, entity)
    }
  };

  const maxLength = (field : string) => {
    if (configs.has('system.org.ent.EntOrg')) {
      var c = configs.get('system.org.ent.EntOrg')
      if (typeof c !== 'undefined') {
        for (var i=0;i<c.fields.length;i++) {
          if (c.fields[i].name === field){
            return c.fields[i].max
          }
        }
      }
    }
    return 30
  }

  //Close this editor
  const close = () => {
    var ids : Array<number> = editorConfig.editors.slice()
    for (var j=0;j<ids.length;j++) {
      const index = ids.indexOf(id);
      if (index > -1) { 
        ids.splice(index, 1); 
      }
    }  
    setEditorConfig ({type: EditorConfigType.editors, payload : ids})
  }

  const title = () => {
    if (typeof entity !== 'undefined') {
      return entity.code
    }
    return '?'
  }

  return (
    <div className='editor-detail'>
      {typeof entity !== 'undefined' &&
      <>
        <p>DETAIL for {title()} (id:{entity.id})</p>
        <p>active= {entity.active ? 'true' : 'false'}</p>
        <div onClick={close}>X</div>
      
          <div> 
            <LangLabel langkey='active'/>
            <Checkbox
              checked={entity.active}
              onChange={handleChangeActive}
            />
          </div>
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
          <div> 
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
          </div>
        </>
      }
    </div>
  )
}

export default OrgDetail
