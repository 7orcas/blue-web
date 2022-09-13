import { useContext, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import LabelsEditor from '../../sys/lang/LabelsEditor'
import OrgEditor from '../../sys/org/OrgEditor'
import Login, {LoginSuccess} from '../../sys/login/Login'
import Test1 from './Test1'
import Test2 from './Test2'
import Test3 from './Test3'

const Body = () => {

  const { session } = useContext(AppContext) as AppContextI
  let navigate = useNavigate();

  //Watch 401s - ie session expired
  useEffect(() => {
    if (!session.loggedIn) {
      navigate("relogin");
    }
  },[session.loggedIn, navigate])

  return (
    <div className='main-body'>
      <Routes>
        <Route path="/" element={<Test1 />} />
        <Route path="relogin" element={<Login />} />
        <Route path="reloginok" element={<LoginSuccess />} />
        <Route path="labels" element={<LabelsEditor />} />
        <Route path="orgadmin" element={<OrgEditor />} />
        <Route path="test2" element={<Test2 />} />
        <Route path="test3" element={<Test3 />} />
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
