import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom';
import AppContext, { AppContextI } from '../../sys/context/AppContext'
import Test1 from './Test1'
import Test2 from './Test2'
import Test3 from './Test3'

const Body = () => {

  const { session } = useContext(AppContext) as AppContextI

  return (
    <Routes>
      <Route path="/" element={<Test1 />} />
      <Route path="test2" element={<Test2 />} />
      <Route path="test3" element={<Test3 />} />
    </Routes>
   
  )
}

export default Body
