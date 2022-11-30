import { useState, useEffect, FC } from 'react'
import { TextField as MuiTextField } from '@mui/material';
import { ConfigI } from '../../definition/interfaces'
import { useLabel, maxLengthText, formatTs } from '../../component/editor/editorUtil'

/*
  Manage TextField input

  [Licence]
  Created 22.09.22
  @author John Stewart
*/

interface Props {
  type? : 'text' | 'int' | 'float' | 'password' | 'timestamp'
  label? : string | undefined
  className? : string
  entity : any
  field : string
  inputProps? : object | undefined
  config? : ConfigI | undefined
  updateEntity? : (entity : any) => void
  required? : boolean
  readonly? : boolean
  changeOnBlur? : boolean
  style? : any
}
  

const TextField : FC<Props> = ({ 
      type='text', 
      label, 
      className='text-field',
      entity, 
      field, 
      inputProps, 
      config,
      updateEntity, 
      required=false, 
      readonly=false,
      changeOnBlur=true,
      style,
     }) => {
  
  const [value, setValue] = useState (type==='text'?'':0)

  //Initialise the field value state
  useEffect(() => {
    const init = () => {
      if (typeof entity !== 'undefined'){
        if (type === 'timestamp') {
          setValue(formatTs(entity[field]))
        }
        else {
          setValue(entity[field])
        }
      }
    }
    init()
  },[entity, field, type])

  if (typeof label === 'undefined') {
    label = field
  }

  if (typeof inputProps === 'undefined') {
    inputProps={ maxLength: maxLengthText(config, field) }
  }

  if (typeof style === 'undefined') {
    style = {}
  }

  const update = (value : any) => {
    entity[field] = value;
    if (typeof updateEntity !== 'undefined') {
      updateEntity(entity)
    }
  }
  
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    var v : any = event.target.value
    switch (type){
      case 'int': 
        v = parseInt(v)
        break
      case 'float':
        v = parseFloat(v)
        break
    }
    update(v);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    if (changeOnBlur === false) {
      update(event.target.value);
    }
  }

  const labelX = useLabel(label)

  const isValid = () => {
    if (type === 'text') {
      return value.toString.length > 0
    }
    return true
  }

  const typex = () => {
    if (type === 'timestamp') return 'text'
    if (type === 'int' || type === 'float') return 'number'
    return type
  }

  return (
    <MuiTextField
      className={className}
      label={labelX}
      error={required && !isValid}
      type={typex()}
      inputProps={inputProps}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      required={required}
      InputProps={{
        readOnly: readonly,
        disableUnderline : readonly
      }}
      variant='filled' //'filled' | 'outlined'* | 'standard'
      style={style}
    />
  )
}

export default TextField
