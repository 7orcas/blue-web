import { FC } from 'react'
import useLabel from '../lang/useLabel'

interface Props {
  label: string
  setSelection: any
}

const MenuItem : FC<Props> = ({ label, setSelection }) => {

  return (
    <div className='menu-item'>
      <button onClick={() => setSelection(label)}>{useLabel(label)}</button>
    </div>
  )
}

export default MenuItem
