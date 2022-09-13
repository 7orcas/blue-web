import { FC, useState, useContext } from 'react'

/*
  Show organisational detail

  [Licence]
  Created 13.09.22
  @author John Stewart
*/

interface OrgProps {
  id : number
}
  

const OrgDetail : FC<OrgProps> = ({ id }) => {
  
  return (
    <div className='editor-detail'>
      <p>DETAIL for {id}</p>
      <p>1234</p>
    </div>
  )
}

export default OrgDetail
