import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

export default function Home() {
  return (
    <div>
      <Link to="/addCourse">
        <Button variant="text">add course</Button>
      </Link>
      <Link to="/courses">
        <Button variant="text">courses</Button>
      </Link>
      <h1>home</h1>
    </div>
  );
}
