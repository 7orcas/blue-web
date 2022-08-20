import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom';
import AppContext, { AppContextI } from '../../sys/context/AppContext'
import Labels from '../../sys/lang/Labels'
import Test1 from './Test1'
import Test2 from './Test2'
import Test3 from './Test3'

const Body = () => {

  const { session } = useContext(AppContext) as AppContextI

  return (
    <div className='main-body'>
      <Routes>
        <Route path="/" element={<Test1 />} />
        <Route path="test2" element={<Test2 />} />
        <Route path="test3" element={<Test3 />} />
        <Route path="labels" element={<Labels />} />
        <Route path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>Body: There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </div>
  )
}

export default Body
