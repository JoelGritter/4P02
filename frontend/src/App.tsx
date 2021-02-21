import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles({
  root: {
    backgroundColor: "black",
    color: "white",
  },
});

export default function App() {
  const classes = useStyles();

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button variant="text" component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button variant="text" component={Link} to="/about" color="inherit">
            about
          </Button>
          <Button variant="text" component={Link} to="/users" color="inherit">
            users
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
