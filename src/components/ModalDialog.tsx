import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

interface MyProps {
  open: boolean
  onClose: Function
  content: JSX.Element
}

const ModalDialog: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const { open, onClose, content } = props;
  return (
    <Modal
      open={open}
      onClose={() => onClose && onClose()}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 5,
        p: '16px 32px 24px',
      }}>
        {content}
      </Box>
    </Modal>
  );
};

export default ModalDialog;
