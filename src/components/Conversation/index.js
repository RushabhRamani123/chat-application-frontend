import React from "react";
import {Stack,Box,} from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";
import SimpleBar from 'simplebar-react';
import { useTheme } from "@emotion/react";
const Conversation = () => {
  const theme = useTheme();
  return (
    <Stack height={"100%"} maxHeight={"100vh"} width={"auto"} >
      <Header />
      <Box width={"100%"} sx={{
        flexGrow: 1,  overflow: 'scroll',
        "&::-webkit-scrollbar": {
          display: "none"
        },
        backgroundColor:
        theme.palette.mode === "light"? "#F0F4FA" : theme.palette.background,
        }}>
        <SimpleBar style={{maxHeight:"80vh"}} timeout={500} clickOnTrack={true}>
        <Message style={{ "&--webkit-scrollbar": { display: "none" }}} /> 
      </SimpleBar>
      </Box>
    <Footer/>
    </Stack>
  );
};

export default Conversation;