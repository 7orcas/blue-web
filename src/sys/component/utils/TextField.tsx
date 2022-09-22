import { useState, useEffect, FC } from 'react'
import { ThemeType } from '../../system/Session';
import useLabel from '../../lang/useLabel';
import { TextField as MuiTextField } from '@mui/material';

/*
  Manage TextField input

  [Licence]
  Created 22.09.22
  @author John Stewart
*/

interface Props {
  type : string
  entity : any
  field : string
  inputProps : object
  updateEntity : (id : number, entity : any) => void
  theme: ThemeType
  required? : boolean
}
  

const TextField : FC<Props> = ({ entity, field, inputProps, updateEntity, theme, required=false }) => {
  
  const [value, setValue] = useState ('')

  //Initialise the field value state
  useEffect(() => {
    const init = () => {
      if (typeof entity !== 'undefined'){
        setValue(entity[field])
      }
    }
    init()
  },[entity, field])


  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    entity[field] = event.target.value;
    updateEntity(entity.id, entity)
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  };

  const label = useLabel('code')

  return (
    <MuiTextField
      error={required && value.length === 0}
      type='text'
      inputProps={inputProps}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      label={label}
      required={required}
      InputLabelProps={{
        style: { color: theme === ThemeType.dark? '#cfcbcb' : '#3d3f4d' },
      }}
      variant='filled'
    />
  )
}

export default TextField
