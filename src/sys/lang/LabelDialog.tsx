import { FC, useState, useContext } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import axios from '../api/apiAxios'
import { Button, TextField } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'

interface LabelDialogProps {
  langkey : string
}

interface LangLabelI {
  id : number
  idLangKey : number
  code : string
  org : number
  active : boolean
}

const LabelDialog : FC<LabelDialogProps> = ({ langkey }) => {

  const [open, setOpen] = useState(false);
  const [labels, setlabels] = useState<LangLabelI[]>([]);
  const { session, setSession } = useContext(AppContext) as AppContextI

  const handleClickOpen = () => {
    const load = async () => {
      try {
        const response = await axios.get(`lang/label?label=${langkey}`)
        let labels : Array<LangLabelI> = []
        for (const l of response.data.data) {
            labels.push ({id : l.id, idLangKey : l.idLangKey, code : l.code, org : l.org, active : l.active})
        }
        setlabels(labels)
        setOpen(true);
        
      } catch (err : any) {
        console.log(err.message)
      } finally {
      }
    }
    load()
  };

  const handleCommit = () => {
    const put = async () => {
      await axios.post('lang/label', labels)
      setOpen(false);
    }
    put()
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div onClick={handleClickOpen} style={{ fontSize:'8px'}}>
        <FontAwesomeIcon icon={faCircleArrowRight} />
      </div>
      <LabelDialogX
        selectedValue={langkey}
        open={open}
        onCommit={handleCommit}
        onClose={handleClose}
        labels={labels}
        setLabels={setlabels}
      />
    </>
  )
}

export default LabelDialog

export interface LabelDialogXProps {
  selectedValue: string
  open: boolean
  onCommit: any
  onClose: any
  labels : LangLabelI[]
  setLabels : any
}

const LabelDialogX : FC<LabelDialogXProps> = ({ onClose, onCommit, selectedValue, open, labels, setLabels }) => {
  
  const handleClose = () => {
    onClose();
  }

  const handleCommit = () => {
    onCommit();
  }

  const handleOnChange = (e : any, i : number) => {
    var x = labels.map(l => l)
    x[i].code = e.target.value
    setLabels(x)
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <div className='lang-dialog-title'>
        <DialogTitle>Language Label</DialogTitle>
      </div>
      <DialogContent>
        <div className='lang-dialog-content'>
          <DialogContentText>
            LangKey: {selectedValue}
            ID: 34
          </DialogContentText>
        </div>
        {labels.map((l,i) => {return(
          <TextField
            key={l.id}
            autoFocus={i === 0}
            margin='dense'
            id='name'
            label={'Org: ' + l.org}
            type='text'
            fullWidth
            value={l.code}
            onChange={e => handleOnChange(e,i)}
            variant='outlined'
            error={!l.code}
          />)}
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCommit}>Commit</Button>
      </DialogActions>

    </Dialog>
  );
}
