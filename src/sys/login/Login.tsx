import './login.css'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AppContext, { AppContextI } from '../system/AppContext'
import { SessionField } from '../system/Session'
import LangLabel from '../lang/LangLabel'
import useLabel from '../lang/useLabel'
import login from './login'
import Button from '../component/utils/Button';
import { JsonResponseI } from '../definition/types';

const Login = () => {

  const { session, setSession } = useContext(AppContext) as AppContextI
  
  const [pw, setPw] = useState ('')
  const [err, setErr] = useState ('')
  
  const setPwX = (txt : string) => {
    setPw(txt)
  }

  const isPw = () => {
    return typeof pw !== 'undefined' && pw.length > 0
  }

  let navigate = useNavigate();

  const loginX = async () => {
    if (!isPw()){
      return;
    }

    const attempt = { u: session.userid, p : pw, o : session.orgNr, l : session.lang };
    var rc = await login (attempt, setErr)
    if (rc === JsonResponseI.ok) {
      setSession ({ type: SessionField.loggedIn, payload: true })
      navigate("reloginok");
    }

  }

  const errMessage = (err : any) => {
    if (typeof err === 'string') {
      return err
    }
    return ''
  }

  return (
    <div className='relogin'>
      <section className='relogin-title'>
        <LangLabel langkey='loginTR' />
      </section>
      <section>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <LangLabel langkey='userid' className='relogin-label'/>
            <input 
              className='field'
              onSubmit={(e) => e.preventDefault()}
              type='text'
              value={session.userid}
              readOnly
            />
          </div>
          <div>
            <LangLabel langkey='pw' className='relogin-label'/>
            <input 
              className='field'
              onSubmit={(e) => e.preventDefault()}
              type='password'
              value={pw}
              autoFocus
              onChange={(e) => setPwX(e.target.value)}
            />
          </div>
          <div className='relogin-button'>
            <Button 
              langkey='login'
              disabled={!isPw()}
              onClick={() => loginX()}
              type='submit'
            />
          </div>
        </form>
      </section>
      <section>
        <div className='error-message'>
          {useLabel(errMessage(err))}
        </div>
      </section>
    </div>
  )
}

export const LoginSuccess = () => {

  return (
    <div className='login-success'>
      <LangLabel langkey='welcback' />
    </div>
  )
}

export default Login
