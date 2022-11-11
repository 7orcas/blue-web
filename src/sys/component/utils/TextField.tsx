import { useState, useEffect, FC, useContext } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import { TextField as MuiTextField } from '@mui/material';
import { ThemeType } from '../../system/Session';
import { ConfigI } from '../../definition/interfaces'
import { useLabel, maxLengthText } from '../../component/editor/editorUtil'

/*
  Manage TextField input

  [Licence]
  Created 22.09.22
  @author John Stewart
*/

interface Props {
  type? : 'text' | 'number' | 'password'
  label? : string | undefined
  entity : any
  field : string
  inputProps? : object | undefined
  config? : ConfigI | undefined
  updateEntity : (entity : any) => void
  required? : boolean
  readonly? : boolean
}
  

const TextField : FC<Props> = ({ 
      type='text', 
      label, 
      entity, 
      field, 
      inputProps, 
      config,
      updateEntity, 
      required=false, 
      readonly=false }) => {
  
  const { session } = useContext(AppContext) as AppContextI
  const [value, setValue] = useState (type==='text'?'':0)

  //Initialise the field value state
  useEffect(() => {
    const init = () => {
      if (typeof entity !== 'undefined'){
        setValue(entity[field])
      }
    }
    init()
  },[entity, field])

  if (typeof label === 'undefined') {
    label = field
  }

  if (typeof inputProps === 'undefined') {
    inputProps={ maxLength: maxLengthText(config, field) }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    entity[field] = event.target.value;
    updateEntity(entity)
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  };

  const labelX = useLabel(label)

  const isValid = () => {
    if (type === 'text') {
      return value.toString.length > 0
    }
    return true
  }

  return (
    <MuiTextField
      className='text-field'
      error={required && !isValid}
      type={type}
      inputProps={inputProps}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      label={labelX}
      required={required}
      InputProps={{
        readOnly: readonly,
        disableUnderline : readonly
      }}
      variant='filled' //'filled' | 'outlined'* | 'standard'
    />
  )
}

export default TextField
