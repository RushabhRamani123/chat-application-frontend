import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box,  IconButton,  Stack,  Typography,  Tabs,  Tab, Grid,} from "@mui/material";
import { ArrowLeft } from "phosphor-react";
import useResponsive from "../hooks/useResponsive";
import { useDispatch } from "react-redux";
import { UpdateSidebarType } from "../redux/slices/app";
import { faker } from "@faker-js/faker";
import { DocMsg, LinkMsg } from "./Conversation/MessageType";
import { Shared_docs, Shared_links } from "../data";

const Media = () => {
  const dispatch = useDispatch();

  const theme = useTheme();

  const isDesktop = useResponsive("up", "md");

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: !isDesktop ? "100vw" : 320, maxHeight: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction="row"
            alignItems={"center"}
            spacing={3}
          >
            <IconButton
               onClick={() => {
                dispatch(UpdateSidebarType("CONTACT"));
              }}
            >
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle2">Shared</Typography>
          </Stack>
        </Box>

        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Media" />
          <Tab label="Links" />
          <Tab label="Docs" />
        </Tabs>
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflow: "scroll",
          }}
          spacing={3}
          padding={value === 1 ? 1 : 3}
        >
          {/* <Conversation starred={true} /> */}
          {(() => {
            switch (value) {
              case 0:
                return (
                  <Grid container spacing={2}>
                    {[0, 1, 2, 3, 4, 5, 6].map((el,index) => (
                      <Grid item xs={4} key={index}>
                        <img
                          src={faker.image.city()}
                          alt={faker.internet.userName()}
                        />
                      </Grid>
                    ))}
                  </Grid>
                );
              case 1:
                return Shared_links?.map((el,index) => <LinkMsg key={index} el={el} />);

              case 2:
                return Shared_docs?.map((el,index) => <DocMsg   key={index} el={el} />);

              default:
                break;
            }
          })()}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Media;