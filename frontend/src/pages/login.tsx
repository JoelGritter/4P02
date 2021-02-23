import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button, { ButtonProps } from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #2196F3 30%, #fff )",
    height: "100vh",
  },
  pageContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: 30,
    borderRadius: 20,
    boxShadow: "0 0 5px 2px rgba(0, 0, 0, .2)",
  },
  paper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    // marginTop: 30,
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    borderRadius: 25,
    boxShadow: "0 0 5px 2px rgba(0, 0, 0, .2)",
    marginTop: 10,
    color: "white",
    height: 35,
    width: 200,
    // padding: "0 30px",
  },
  usernameInput: {
    margin: 5,
    borderRadius: 25,
    border: "none",
    boxShadow: "0 0 5px 2px rgba(0, 0, 0, .2)",
    height: 35,
    width: 200,
  },
  passwordInput: {
    margin: 5,
    borderRadius: 25,
    border: "none",
    boxShadow: "0 0 5px 2px rgba(0, 0, 0, .2)",
    height: 35,
    width: 200,
  },
  loginLink: {
    textDecoration: "none",
  },
});

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  console.log(username);
  const classes = useStyles();
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
          {/* <p>Logo</p> */}
          <p>Login Form</p>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className={classes.usernameInput}
          />
          <input
            type="text"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className={classes.passwordInput}
          />
          <Link to="/home" className={classes.loginLink}>
            {/* <Button variant="text">Login</Button> */}
            <Button className={classes.loginButton}>login</Button>
          </Link>
        </div>
      </Grid>
    </Grid>
  );
}
