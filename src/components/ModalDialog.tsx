import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

interface MyProps {
  open: boolean
  onClose: Function
  content: JSX.Element
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  paper: {
    position: 'absolute',
    width: '80%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ModalDialog: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const { open, onClose, content } = props;
  const body = (
    <div style={modalStyle} className={classes.paper}>
      {content}
    </div>
  );
  return (
    <Modal
      open={open}
      onClose={() => onClose && onClose()}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
};

export default ModalDialog;
