import { useState, useContext, useEffect } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import loadOrg, { OrgI } from './loadOrg'

/*
  Show organisational detail

  [Licence]
  Created 13.09.22
  @author John Stewart
*/

interface OrgProps {
  id : number
}
  

const OrgDetail : React.FC<OrgProps> = ({ id }) => {
  
  const { setSession, setMessage } = useContext(AppContext) as AppContextI

  const [dataSource, setDataSource] = useState<OrgI>()

  useEffect(() => {
    const loadOrgX = async() => {
      var l : OrgI | undefined = await loadOrg(id, setSession, setMessage)
      if (typeof l !== 'undefined') {
        setDataSource(l)
      }
    }
    loadOrgX()
  },[])


  return (
    <div className='editor-detail'>
      <p>DETAIL for {id}</p>
      <p>active= {typeof dataSource !== 'undefined' ? dataSource.active ? 'true' : 'false' : 'n/a'}</p>
    </div>
  )
}

export default OrgDetail
