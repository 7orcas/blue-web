import { useContext, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import AppContext, { AppContextI } from '../../sys/system/AppContext'
import LabelsEditor from '../../sys/lang/LabelsEditor'
import OrgEditor from '../../sys/org/OrgEditor'
import PermissionEditor from '../../sys/role/PermissionEditor'
import RoleEditor from '../../sys/role/RoleEditor'
import UserEditor from '../../sys/user/UserEditor'
import LoginsEditor from '../../sys/logins/LoginsEditor'
import Login, {LoginSuccess, Logout} from '../../sys/login/Login'
import Test2 from './Test2'
import Test3 from './Test3'
import ChangePW from '../../sys/user/ChangePW'
import Home from './Home'

const Body = () => {

  const { session } = useContext(AppContext) as AppContextI
  let navigate = useNavigate()

  //Watch 401s - ie session expired
  useEffect(() => {
    if (!session.loggedIn) {
      navigate("relogin")
    }
  },[session.loggedIn, navigate])

  return (
    <div className='main-body'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="relogin" element={<Login />} />
        <Route path="reloginok" element={<LoginSuccess />} />
        <Route path="logout" element={<Logout />} />
        <Route path="labels" element={<LabelsEditor />} />
        <Route path="orgadmin" element={<OrgEditor />} />
        <Route path="permadmin" element={<PermissionEditor />} />
        <Route path="roleadmin" element={<RoleEditor />} />
        <Route path="useradmin" element={<UserEditor />} />
        <Route path="logins" element={<LoginsEditor />} />
        <Route path="passchg" element={<ChangePW />} />
        <Route path="test2" element={<Test2 />} />
        <Route path="test3" element={<Test3 />} />
        <Route path="*" />
      </Routes>
      <>
      </>
    </div>
  )
}

export default Body
