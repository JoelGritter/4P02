import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Login from "./pages/login";
import AddCourse from "./pages/addCourse";
import Assignments from "./pages/assignments";
import Courses from "./pages/courses";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Tests from "./pages/tests";

const useStyles = makeStyles({
  root: {
    // backgroundColor: "black",
    // color: "white",
  },
});

export default function App() {
  const classes = useStyles();

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login" component={Login}>
            <Login />
          </Route>
          <Route path="/addCourse" component={AddCourse}>
            <AddCourse />
          </Route>
          <Route path="/assignments" component={Assignments}>
            <Assignments />
          </Route>
          <Route path="/courses" component={Courses}>
            <Courses />
          </Route>
          <Route path="/home" component={Home}>
            <Home />
          </Route>
          <Route path="/profile" component={Profile}>
            <Profile />
          </Route>
          <Route path="/tests" component={Tests}>
            <Tests />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
