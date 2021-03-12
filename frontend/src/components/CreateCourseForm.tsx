import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

interface CreateCourseFormProps {
  courseName: string;
  instructor: string;
  description: string;
  changeCourseName: any;
  changeInstructor: any;
  changeDescription: any;
}

export const CreateCourseForm: React.FC<CreateCourseFormProps> = ({
  courseName,
  instructor,
  description,
  changeCourseName,
  changeInstructor,
  changeDescription,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="courseName"
            label="Course Name"
            value={courseName}
            onChange={changeCourseName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="instructor"
            label="Instructor"
            value={instructor}
            onChange={changeInstructor}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            label="Description"
            value={description}
            onChange={changeDescription}
          />
        </Grid>
      </Grid>
    </div>
  );
};
