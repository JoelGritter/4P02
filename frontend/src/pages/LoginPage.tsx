import React, { useState } from "react";
import { Link } from "react-router-dom";
import {  makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background: "linear-gradient(45deg, #2196F3 30%, #fff )",
    height: "100vh",
  },
  pageContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(3),
    borderRadius: 20,
    boxShadow: "0 0 5px 2px rgba(0, 0, 0, .2)",
  },
  paper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    borderRadius: 25,
    boxShadow: "0 0 5px 2px rgba(0, 0, 0, .2)",
    marginTop: 10,
    color: "white",
    height: 35,
    width: 200,
  },
  usernameInput: {
    margin: theme.spacing(1),
    width: 200,
  },
  passwordInput: {
    margin: theme.spacing(1),
    width: 200,
  },
  loginLink: {
    margin: theme.spacing(1),
    textDecoration: "none",
  },
}));

export default function LoginPage() {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={10}
        square
        className={classes.paper}
      >
        <div className={classes.pageContainer}>
          <Typography variant="h5">Login Form</Typography>
          <TextField
            id="standard-basic"
            label="Username"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={classes.usernameInput}
          />
          <TextField
            id="standard-basic"
            label="Password"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={classes.passwordInput}
          />
          <Link to="/home" className={classes.loginLink}>
            <Button className={classes.loginButton}>login</Button>
          </Link>
        </div>
      </Grid>
    </Grid>
  );
}
