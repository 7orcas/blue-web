import { FC } from 'react'
import useLabel from '../../lang/useLabel'
import { Accordion as AccordionMui, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
  langkey : string,
  children : any
}

const Accordion : FC<Props> = ({ langkey, children}) => {
  
  return (
    <AccordionMui
      className='accordion'
      disableGutters={true}
      TransitionProps={{
        timeout: 0
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{useLabel(langkey)}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          {children}
        </Typography>
      </AccordionDetails>
    </AccordionMui>
  );
  
}

export default Accordion