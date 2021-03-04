import React from "react";
import { Link } from "react-router-dom";
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
