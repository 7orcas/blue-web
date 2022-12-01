import { useContext, FC } from 'react'
import AppContext, { AppContextI } from '../../system/AppContext'
import { SessionField } from '../../system/Session'
import useLabel from '../../lang/useLabel'
import { Accordion as AccordionMui, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
  langkey : string,
  componentId: string,
  children : any
}

/*
  Display an accordion

  [Licence]
  Created 01.10.22
  @author John Stewart
*/
const Accordion : FC<Props> = ({ langkey, componentId, children}) => {
  
  const { session, setSession } = useContext(AppContext) as AppContextI

  const isExpanded = () => {
    var v = session.flags.get(componentId)
    if (typeof v === 'undefined') return false
    return v
  }

  const handleClick = () => {
    var v = session.flags.get(componentId)
    if (typeof v === 'undefined') v = false
    setSession ({ type: SessionField.flags, payload: new Map(session.flags.set(componentId, !v))})
    return v
  }

  return (
    <AccordionMui
      className='accordion'
      disableGutters={true}
      TransitionProps={{
        timeout: 0
      }}
      expanded={isExpanded()}
      >
        <div onClick={() => handleClick()}>
          <AccordionSummary
            aria-controls="panel1a-content"
            id="panel1a-header"
            expandIcon={
              <ExpandMoreIcon style={{ cursor: 'pointer' }}/>
              }
          >
            <Typography>{useLabel(langkey)}</Typography>
          </AccordionSummary>
      </div>
      <AccordionDetails>
        <Typography component={'span'}>
          {children}
        </Typography>
      </AccordionDetails>
    </AccordionMui>
  );
  
}

export default Accordion