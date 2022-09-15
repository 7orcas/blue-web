import { useState, useContext, useEffect } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { Checkbox, TextField } from '@mui/material';
import loadOrg, { OrgI } from './loadOrg'
import LangLabel from '../lang/LangLabel';

/*
  Show organisational detail

  [Licence]
  Created 13.09.22
  @author John Stewart
*/

interface OrgProps {
  id : number
  org : OrgI | undefined
  updateOrg : any
}
  

const OrgDetail : React.FC<OrgProps> = ({ id, org, updateOrg }) => {
  
  // const { setSession, setMessage } = useContext(AppContext) as AppContextI

  // const [dataSource, setDataSource] = useState<OrgI>()

  // useEffect(() => {
  //   const loadOrgX = async() => {
  //     var l : OrgI | undefined = await loadOrg(id, setSession, setMessage)
  //     if (typeof l !== 'undefined') {
  //       setDataSource(l)
  //     }
  //   }
  //   loadOrgX()
  // },[])

  const handleChangeActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof org !== 'undefined'){
      org.active = event.target.checked;
      updateOrg(id, org)
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof org !== 'undefined'){
      const { name } = event.target;
      switch (name) {
        case 'dvalue': org.dvalue = org.dvalue = event.target.checked; break
        case 'code': 
          org.code = event.target.value; 
console.log('code=' + org.code + '  e='+event.target.value)          
          break
      }
      updateOrg(id, org)
    }
  };

  const title = () => {
    if (typeof org !== 'undefined') {
      return org.code
    }
    return '?'
  }

  return (
    <div className='editor-detail'>
      <>
        <p>DETAIL for {title()}</p>
        <p>active= {typeof org !== 'undefined' ? org.active ? 'true' : 'false' : 'n/a'}</p>
      </>
      {typeof org !== 'undefined' &&
        <>
          <div> 
            <LangLabel langkey='active'/>
            <Checkbox
              checked={org.active}
              onChange={handleChangeActive}
            />
          </div>
          <div> 
            <LangLabel langkey='code'/>
            <TextField
              name='code'
              type='text'
              value={org.code}
              onChange={handleChange}
            />
          </div>
          <div> 
            <LangLabel langkey='dvalue'/>
            <Checkbox
              name='dvalue'
              checked={org.dvalue}
              onChange={handleChange}
            />
          </div>
        </>
      }
    </div>
  )
}

export default OrgDetail
