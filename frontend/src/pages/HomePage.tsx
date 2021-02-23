import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

export default function HomePage() {
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
