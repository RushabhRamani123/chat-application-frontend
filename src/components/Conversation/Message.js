import React from 'react';
import { Box, Stack } from '@mui/material';
import { Chat_History } from '../../data';
import {Timeline,TextMsg,MediaMsg,LinkMsg,DocMsg, ReplyMsg} from './MessageType';
const Message = () => {
  return (
    <Box p={3} style={{ "&--webkit-scrollbar": { display: "none" }, }}><Stack direction="column" spacing={3}>
        {Chat_History.map((el) => {
          switch (el.type) {
            case "divider":
              return(<Timeline el={el}/>);
              
            case "msg":
              switch (el.subtype) {
                case "img":
                return <MediaMsg el={el} />
                  case "doc":
                    return <DocMsg el={el} />
                    case "link":
                  return <LinkMsg el={el} />
                case "reply":
                  return <ReplyMsg el={el} />
                default:
                  return <TextMsg el={el} /> 
              }
            default:
              return (<></>);
          }
        
        })}
        </Stack>
   </Box>
  )
}

export default Message
