import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Course from '../api/data/models/course.model';
import useGet from '../api/data/use-get';
import { PublicUser } from '../api/data/models/user.model';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CircularProgress, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

interface CreateCourseFormProps {
  course: Course;
  setCourse: Dispatch<SetStateAction<Course>>;
}

export const CourseForm: React.FC<CreateCourseFormProps> = ({
  course,
  setCourse,
}) => {
  const classes = useStyles();

  const handleProfessorsChange = (e: any, value: PublicUser[]) => {
    setCourse((prev) => ({
      ...prev,
      currentProfessors: value.map((user) => user.cognitoId),
    }));
  };

  const { data: users, loading, failed } = useGet<PublicUser[]>(
    '/user/public/prof'
  );

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
        <Grid item xs={12}>
          {users && (
            <Autocomplete
              multiple
              id="course-professors-autocomplete"
              options={users}
              getOptionLabel={(user) => user?.email}
              onChange={handleProfessorsChange}
              value={users.filter((user) =>
                course.currentProfessors?.includes(user.cognitoId)
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Professors"
                  variant="outlined"
                />
              )}
            />
          )}
          {loading && <CircularProgress />}
          {failed && (
            <Typography variant="body1" color="error">
              Failed to load professors!
            </Typography>
          )}
        </Grid>
      </Grid>
    </div>
  );
};
