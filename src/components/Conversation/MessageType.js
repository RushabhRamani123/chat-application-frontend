import { Divider, Stack, Typography, Box, IconButton, Menu , MenuItem } from "@mui/material";
import { useTheme , alpha} from "@mui/material/styles";
import { Link } from "react-router-dom";
import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";
import React from "react";
import { Message_options } from "../../data";
const TextMsg = ({ el }) => {
  const theme = useTheme();
  return (
    
    <Stack direction="row" alignItems={"start"} justifyContent={el.incoming ? "start" : "end"}>
      <Box
       px={1.5}
       py={1.5}
       sx={{
         backgroundColor: el.incoming? theme.palette.background.paper: theme.palette.primary.main,
         borderRadius: 1.5,
         width: "max-content",
       }}
      >
        <Typography
          variant="body2"
          color={el.incoming ? theme.palette.text : "#fff"}>
          {el.message}
        </Typography>
      </Box>
      <MessageOption />
    </Stack>
  );
};
const MediaMsg = ({ el }) => {
    const theme = useTheme();
    return (
      <Stack direction="row" alignItems={"start"} justifyContent={el.incoming ? "start" : "end"}>
        <Box
         px={1.5}
         py={1.5}
         sx={{
           backgroundColor: el.incoming? theme.palette.background.paper: theme.palette.primary.main,
           borderRadius: 1.5,
           width: "max-content",
         }}>
          <Stack spacing={1}>
            <img
              src={el.img}
              alt={el.message}
              style={{ maxHeight: 210, borderRadius: "10px" }}
            />
            <Typography
              variant="body2"
              color={el.incoming ? theme.palette.text : "#fff"}
            >
              {el.message}
            </Typography>
          </Stack>
        </Box>
        <MessageOption />
      </Stack>
    );
};
  const LinkMsg = ({ el }) => {
    const theme = useTheme();
    return (
      <Stack direction="row" alignItems={"start"} justifyContent={el.incoming ? "start" : "end"}>
        <Box
          px={1.5}
          py={1.5}
          sx={{
            backgroundColor: el.incoming? theme.palette.background.paper: theme.palette.primary.main,
            borderRadius: 1.5,
            width: "max-content",
          }}
        >
          <Stack spacing={2}>
            <Stack
              p={2}
              direction="column"
              spacing={3}
              alignItems="start"
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
              }}
            >
              <img
                src={el.preview}
                alt={el.message}
                style={{ maxHeight: 210, borderRadius: "10px" }}
              />
              <Stack direction={"column"} spacing={2}>
                <Typography variant="subtitle2" textAlign={"start"}>
                  Creating Chat App using MERN
                </Typography>
                <Typography
                  component={Link}
                  to="//https://www.youtube.com"
                  variant="subtitle2"
                  sx={{ color: theme.palette.primary.main }}
                >
                  {/* {truncateString("www.youtube.com/watch/v12uqywHTY2", 16)}
                   */}
                  www.youtube.com/watch/v12uqywHTY2
            <Typography
              variant="body2"
              color={el.incoming ? theme.palette.text : "#fff"}
            >
              {el.message}
            </Typography>
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
        <MessageOption />
      </Stack>
    );
};
const DocMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems={"start"} justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? theme.palette.background.paper
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Image size={48} />
            <Typography variant="caption">Abstract.png</Typography>
            <IconButton>
              <DownloadSimple />
            </IconButton>
          </Stack>
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.message}
          </Typography>
        </Stack>
      </Box>
      <MessageOption />
    </Stack>
  );
};
const Timeline = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} alignItems={"center"} spacing={2}>
      <Divider width="46%" />
      <Typography variant="caption" sx={{ color: theme.palette.text }}>{el.text}</Typography>
      <Divider width="46%" />
    </Stack>
  );
};
const ReplyMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems={"start"} justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.paper, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="column"
            spacing={3}
            alignItems="center"
            sx={{backgroundColor: alpha(theme.palette.background.paper, 1),borderRadius: 1}}>
            <Typography variant="body2" color={theme.palette.text}>
              {el.message}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.reply}
          </Typography>
        </Stack>
      </Box>
      <MessageOption />
    </Stack>
  );
}; 
const MessageOption = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      <DotsThreeVertical
      id="basic-button"
      aria-controls={open ? 'basic-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleClick}/>
     <Menu
         id="basic-menu"
         anchorEl={anchorEl}
         open={open}
         onClose={handleClose}
         MenuListProps={{
           'aria-labelledby': 'basic-button',
         }}
      >
        <Stack spacing={1} padding={1}>
          {Message_options.map((el) => {
            return <MenuItem key={el.id} onClick={handleClose}>{el.title}</MenuItem>;
          })
            
        }
        </Stack>
      </Menu>
    </Stack>
  );
}

export { Timeline, TextMsg, MediaMsg, LinkMsg, DocMsg, ReplyMsg, MessageOption};
