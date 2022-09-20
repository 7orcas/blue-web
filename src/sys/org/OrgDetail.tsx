import { OrgEntI as EntityI } from './org'
import LangLabel from '../lang/LangLabel';
import { Checkbox, TextField } from '@mui/material';

/*
  Show organisational detail

  [Licence]
  Created 13.09.22
  @author John Stewart
*/

interface OrgProps {
  id : number
  entity : EntityI | undefined
  updateEntity : any
}
  

const OrgDetail : React.FC<OrgProps> = ({ id, entity, updateEntity }) => {
  
  const handleChangeActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof entity !== 'undefined'){
      entity.active = event.target.checked;
      updateEntity(id, entity)
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof entity !== 'undefined'){
      const { name } = event.target;
      switch (name) {
        case 'dvalue': entity.dvalue = entity.dvalue = event.target.checked; break
        case 'code': 
          entity.code = event.target.value; 
console.log('code=' + entity.code + '  e='+event.target.value)          
          break
      }
      updateEntity(id, entity)
    }
  };

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
          <div> 
            <LangLabel langkey='code'/>
            <TextField
              name='code'
              type='text'
              value={entity.code}
              onChange={handleChange}
            />
          </div>
          <div> 
            <LangLabel langkey='dvalue'/>
            <Checkbox
              name='dvalue'
              checked={entity.dvalue}
              onChange={handleChange}
            />
          </div>
        </>
      }
    </div>
  )
}

export default OrgDetail
