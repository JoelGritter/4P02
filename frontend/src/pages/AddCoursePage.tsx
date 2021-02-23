import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

export default function AddCoursePage() {
  return (
    <div>
      <Link to="/courses">
        <Button variant="text">courses</Button>
      </Link>
      <h1>addCourse</h1>
    </div>
  );
}
