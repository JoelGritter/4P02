import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

export default function CreateCoursePage() {
  return (
    <div>
      <Link to="/courses">
        <Button variant="text">CreateCourse</Button>
      </Link>
      <h1>CreateCourse</h1>
    </div>
  );
}
