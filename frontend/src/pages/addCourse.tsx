import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

export default function addCourse() {
  return (
    <div>
      <Link to="/courses">
        <Button variant="text">courses</Button>
      </Link>
      <h1>addCourse</h1>
    </div>
  );
}
