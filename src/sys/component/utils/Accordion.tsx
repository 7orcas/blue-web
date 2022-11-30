import { FC } from 'react'
import useLabel from '../../lang/useLabel'
import { Accordion as AccordionMui, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
  langkey : string,
  handleExpand : any,
  expand: boolean,
  children : any
}

/*
  Display an accordion

  [Licence]
  Created 01.10.22
  @author John Stewart
*/
const Accordion : FC<Props> = ({ langkey, handleExpand, expand, children}) => {
  
  return (
    <AccordionMui
      className='accordion'
      disableGutters={true}
      TransitionProps={{
        timeout: 0
      }}
      expanded={expand}
      >
        <div onClick={() => handleExpand()}>
          <AccordionSummary
            // expandIcon={<ExpandMoreIcon />}
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