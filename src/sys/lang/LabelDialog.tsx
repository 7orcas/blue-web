import { FC, useState, useContext } from 'react'
import AppContext, { AppContextI } from '../system/AppContext'
import { SessionField } from '../system/Session'
import loadLabels from '../lang/loadLabels'
import apiGet from '../api/apiGet'
import apiPost from '../api/apiPost'
import { Button, TextField } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'

interface LabelDialogProps {
  langkey : string
}

interface LangLabelI {
  id : number
  langKey : string
  idLangKey : number
  code : string
  orgNr : number
  active : boolean
}

const LabelDialog : FC<LabelDialogProps> = ({ langkey }) => {

  const { setSession, setMessage } = useContext(AppContext) as AppContextI
  
  const [open, setOpen] = useState(false);
  const [labels, setlabels] = useState<LangLabelI[]>([]);

  const handleClickOpen = () => {
    const load = async () => {
      try {
        const data = await apiGet(`lang/label?langKey=${langkey}`, setMessage, setSession)
        
        let labels : Array<LangLabelI> = []
        for (const l of data) {
            labels.push ({id : l.id, langKey : l.langKey, idLangKey : l.idLangKey, code : l.code, orgNr : l.orgNr, active : l.active})
        }
        setlabels(labels)
        setOpen(true)
        
      } catch (err : any) {
        console.log(err.message)
      } finally {
      }
    }
    load()
  };

  const handleCommit = () => {
    const put = async () => {
      await apiPost('lang/label', labels, setMessage, setSession)

      const l = await loadLabels('', setMessage, setSession)
      setSession ({ type: SessionField.labels, payload: l })
      setOpen(false)
    }
    put()
  };

  const handleClose = () => {
    setOpen(false)
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
      <div className='lang-dialog'>
        <div className='lang-dialog-title'>
          <DialogTitle>Language Label</DialogTitle>
        </div>
        <DialogContent>
          <div className='lang-dialog-content'>
            <DialogContentText>
              <div>LangKey: {selectedValue}</div>
              <div>ID: 34</div>
            </DialogContentText>
          </div>
          {labels.map((l,i) => {return(
            <TextField
              key={l.id}
              autoFocus={i === 0}
              margin='dense'
              id='name'
              label={'Org: ' + l.orgNr}
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
          <Button onClick={handleCommit} className='dialog-color dialog-button'>Commit</Button>
          <Button onClick={handleClose} className='dialog-color'>Cancel</Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
