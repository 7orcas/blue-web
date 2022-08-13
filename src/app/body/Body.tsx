import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom';
import AppContext, { AppContextI } from '../../sys/context/AppContext'
import Test1 from './Test1'
import Test2 from './Test2'

const Body = () => {

  const { baseUrl, setLabels } = useContext(AppContext) as AppContextI

  return (
    <Routes>
      <Route path="/" element={<Test1 />} />
      <Route path="test2" element={<Test2 />} />
    </Routes>
   
  )
}

export default Body
