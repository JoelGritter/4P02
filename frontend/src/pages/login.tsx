import { ImportantDevicesTwoTone } from "@material-ui/icons";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Home from "../pages/home";

export default function Login() {
  return (
    <div>
      <Link to="/home">
        <Button variant="text">home</Button>
      </Link>
      <h1>Login Page</h1>
    </div>
  );
}
