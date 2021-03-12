import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useSnackbar } from "notistack";
import { CreateCourseForm } from "../../components/CreateCourseForm";
import { post } from "../../api/util";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  headerContainer: {
    display: "flex",
    margin: theme.spacing(1),
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {},
  button: {
    margin: theme.spacing(1),
  },
}));

export default function CreateCoursePage() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const courseHandler = async () => {
    const { success, message } = await post("/course", {
      courseName: courseName,
      instructor: instructor,
      description: description,
    });
    if (!success) {
      enqueueSnackbar(
        message ?? `Couldn't add "${courseName}" to your courses!`
      );
    } else {
      enqueueSnackbar(message ?? `Added ${courseName} to your courses!`);
    }
  };

  const [courseName, setCourseName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [description, setDescription] = useState("");

  const handleCourseNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCourseName(event.target.value);
  };

  const handleInstructorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInstructor(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleClear = () => {
    setCourseName("");
    setInstructor("");
    setDescription("");
  };

  return (
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <Typography variant="h4">CreateCourse</Typography>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={courseHandler}
          >
            Create
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      </div>
      <CreateCourseForm
        courseName={courseName}
        instructor={instructor}
        description={description}
        changeCourseName={handleCourseNameChange}
        changeInstructor={handleInstructorChange}
        changeDescription={handleDescriptionChange}
      />
    </div>
  );
}
