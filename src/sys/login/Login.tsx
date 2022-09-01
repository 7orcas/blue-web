import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AppContext, { AppContextI } from '../system/AppContext'
import { SessionReducer } from '../system/Session'
import LangLabel from '../lang/LangLabel'
import useLabel from '../lang/useLabel'
import login from './login'
import Button from '../utils/Button';

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
    var r = await login (attempt, setErr)
    if (r) {
      setSession ({ type: SessionReducer.loggedIn, payload: true })
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
    <>
      <section className='title'>
        <LangLabel langkey='loginTR' />
      </section>
      <section>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className='label-field'>
            <LangLabel langkey='userid' />
            <input 
              className='field'
              onSubmit={(e) => e.preventDefault()}
              type='text'
              value={session.userid}
              readOnly
            />
          </div>
          <div className='label-field'>
            <LangLabel langkey='pw' />
            <input 
              className='field'
              onSubmit={(e) => e.preventDefault()}
              type='password'
              value={pw}
              onChange={(e) => setPwX(e.target.value)}
            />
          </div>
          <Button 
            langkey='login'
            disabled={!isPw()}
            onClick={() => loginX()}/>
        </form>
      </section>
      <section>
        <div className='error-message'>
          {useLabel(errMessage(err))}
        </div>
      </section>
    </>
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
