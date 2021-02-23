import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

export default function CoursesPage() {
  return (
    <div>
      <Link to="/assignments">
        <Button variant="text">assignments</Button>
      </Link>
      <Link to="/tests">
        <Button variant="text">tests</Button>
      </Link>
      <Link to="/profile">
        <Button variant="text">profile</Button>
      </Link>
      <h1>courses</h1>
    </div>
  );
}
