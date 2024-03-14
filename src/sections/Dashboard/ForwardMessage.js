import React from 'react'
import { Dialog, DialogContent, Slide, Stack, Tab, Tabs } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const ForwardMessage = ({open, handleClose}) => {
  
   
    return (
    <Dialog
    fullWidth
    maxWidth="xs"
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={ handleClose  }
    aria-describedby="alert-dialog-slide-description"
    sx={{ p: window.innerWidth <400 ? -4 : 4 }}
  >
            Rushabh Ramani
            <button >Click</button>
  </Dialog>
  )
}

export default ForwardMessage
