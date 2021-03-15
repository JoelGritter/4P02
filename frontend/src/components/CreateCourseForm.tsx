import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Course from '../api/data/models/course.model';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

interface CreateCourseFormProps {
  course: Course;
  setCourse: any;
}

export const CreateCourseForm: React.FC<CreateCourseFormProps> = ({
  course,
  setCourse,
}) => {
  const classes = useStyles();

  const handleFormChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    setCourse((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            id="name"
            name="name"
            label="Course Name"
            value={course?.name}
            onChange={handleFormChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            id="description"
            name="description"
            label="Description"
            value={course?.description}
            onChange={handleFormChange}
          />
        </Grid>
      </Grid>
    </div>
  );
};
