import React from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import Brightness4Icon from "@material-ui/icons/Brightness4";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  content: {
    marginTop: 75,
  },
}));

export default function Layout(props) {
  const classes = useStyles();
  const currentTheme = localStorage.getItem("theme");
  const [theme, setTheme] = React.useState({
    palette: {
      type: currentTheme ? currentTheme : "light",
    },
  });
  const toggleTheme = () => {
    let newPaletteType = theme.palette.type === "light" ? "dark" : "light";
    setTheme({
      ...theme,
      palette: {
        type: newPaletteType,
      },
    });
  };

  React.useEffect(() => {
    localStorage.setItem("theme", theme.palette.type);
  }, [theme]);

  const muiTheme = createMuiTheme(theme);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <Link
              color="inherit"
              href="/"
              variant="h6"
              className={classes.title}
            >
              Leetcode Visualizer
            </Link>
            <Button href="/update" variant="contained">
              Update
            </Button>
            <IconButton onClick={toggleTheme}>
              {theme.palette.type === "light" ? (
                <Brightness5Icon style={{ color: "white" }} />
              ) : (
                <Brightness4Icon style={{ color: "black" }} />
              )}
            </IconButton>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>{props.children}</main>
      </div>
    </ThemeProvider>
  );
}
