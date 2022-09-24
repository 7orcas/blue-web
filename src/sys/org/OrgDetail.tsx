import { useContext, FC } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { OrgEntI as EntityI } from './org'
import { ConfigI, ConfigFieldI } from '../definition/interfaces';
import LangLabel from '../lang/LangLabel';
import { Checkbox, FormControl } from '@mui/material'
import TextField from '../component/utils/TextField'
import useLabel from '../lang/useLabel';


/*
  Show organisational detail

  [Licence]
  Created 13.09.22
  @author John Stewart
*/

interface Props {
  id : number
  config : ConfigI | undefined
  entity : EntityI | undefined
  updateEntity : any
}
  

const OrgDetail : FC<Props> = ({ id, config, entity, updateEntity }) => {
  
  const { session } = useContext(AppContext) as AppContextI
  
  const handleChangeActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof entity !== 'undefined'){
      entity.active = event.target.checked;
      updateEntity(id, entity)
    }
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
    if (typeof config !== 'undefined') {
      for (var i=0;i<config.fields.length;i++) {
        if (config.fields[i].name === field){
          return config.fields[i].max
        }
      }
    }
    return 30
  }

  const title = () => {
    if (typeof entity !== 'undefined') {
      return entity.code
    }
    return '?'
  }

  return (
    <div className='editor-detail'>
      <>
        <p>DETAIL for {title()}</p>
        <p>active= {typeof entity !== 'undefined' ? entity.active ? 'true' : 'false' : 'n/a'}</p>
      </>
      {typeof entity !== 'undefined' &&
        <>
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
