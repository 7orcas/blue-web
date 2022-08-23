import { FC, useState, useContext } from 'react'
import AppContext, { AppContextI } from '../context/AppContext'
import axios from '../api/apiAxios'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'

interface LabelDialogProps {
  langkey : string
}

interface LangLabelI {
  id : number
  idLangKey : number
  label : string
  org : number
  active : boolean
}

const LabelDialog : FC<LabelDialogProps> = ({ langkey }) => {

  const [open, setOpen] = useState(false);
  const [labels, setlabels] = useState<LangLabelI[]>([]);
  const { session, dispatch } = useContext(AppContext) as AppContextI

  const handleClickOpen = () => {
    const load = async () => {
      try {
        const response = await axios.get(`${session.baseUrl}/lang/label?label=${langkey}`, {withCredentials: true})
        let labels : Array<LangLabelI> = []
        for (const l of response.data.data) {
            labels.push ({id : l.i, idLangKey : l.idLangKey, label : l.c, org : l.o, active : l.a})
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

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div onClick={handleClickOpen} style={{ fontSize:'8px'}}>
        <FontAwesomeIcon icon={faCircleArrowRight} />
      </div>
      <SimpleDialog
        selectedValue={langkey}
        open={open}
        onClose={handleClose}
        labels={labels}
      />
    </>
  )
}

export default LabelDialog

export interface SimpleDialogProps {
  selectedValue: string
  open: boolean
  onClose: any
  labels : LangLabelI[]
}

const SimpleDialog : FC<SimpleDialogProps> = ({ onClose, selectedValue, open, labels }) => {
  
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Language Label</DialogTitle>
      Key:{selectedValue}
      {labels.map(l => 
      <>
        <p>{l.org}</p>
        <p>{l.label}</p>
      </>
      )}
    </Dialog>
  );
}
