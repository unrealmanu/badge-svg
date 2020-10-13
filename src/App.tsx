import AppBar from "@material-ui/core/AppBar/AppBar";
import Box from "@material-ui/core/Box/Box";
import Container from "@material-ui/core/Container/Container";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import React from "react";
import { ManageSvg } from "./components/ManageSvg";

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" aria-label="menu"></IconButton>
          <Typography variant="h6">Badge-svg</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box m={1}>
          <ManageSvg></ManageSvg>
        </Box>
      </Container>
    </>
  );
}

export default App;
