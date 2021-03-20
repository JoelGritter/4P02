import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Course from '../api/data/models/course.model';
import useGet from '../api/data/use-get';
import { PublicUser } from '../api/data/models/user.model';
import Autocomplete from '@material-ui/lab/Autocomplete';
import RequestStatus from './RequestStatus';

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

  const handleStudentsChange = (e: any, value: PublicUser[]) => {
    setCourse((prev) => ({
      ...prev,
      students: value.map((user) => user.cognitoId),
    }));
  };

  const handleModeratorsChange = (e: any, value: PublicUser[]) => {
    setCourse((prev) => ({
      ...prev,
      moderators: value.map((user) => user.cognitoId),
    }));
  };

  const { data: profs, loading: profsLoading, failed: profsFailed } = useGet<
    PublicUser[]
  >('/user/public/prof');

  const { data: users, loading: usersLoading, failed: usersFailed } = useGet<
    PublicUser[]
  >('/user/public');

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
          {profs && (
            <Autocomplete
              multiple
              id="course-professors-autocomplete"
              options={profs}
              getOptionLabel={(user) => user?.email}
              onChange={handleProfessorsChange}
              value={profs.filter((user) =>
                course.currentProfessors?.includes(user.cognitoId)
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Professors"
                  variant="outlined"
                  helperText="You will automatically be added to this list"
                />
              )}
            />
          )}
          <RequestStatus
            loading={profsLoading}
            failed={profsFailed}
            failedMessage="Failed to load professors!"
          />
        </Grid>
        {users && (
          <>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="course-moderators-autocomplete"
                options={users}
                getOptionLabel={(user) => user?.email}
                onChange={handleModeratorsChange}
                value={users.filter((user) =>
                  course.moderators?.includes(user.cognitoId)
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Moderators"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="course-students-autocomplete"
                options={users}
                getOptionLabel={(user) => user?.email}
                onChange={handleStudentsChange}
                value={users.filter((user) =>
                  course.students?.includes(user.cognitoId)
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Students"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <RequestStatus
            loading={usersLoading}
            failed={usersFailed}
            failedMessage="Failed to load users!"
          />
        </Grid>
      </Grid>
    </div>
  );
};
