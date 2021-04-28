import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import { CourseForm } from '../../components/CourseForm';
import { update } from '../../api/util';
import Course from '../../api/data/models/course.model';
import { useHistory, useParams } from 'react-router';
import useGet from '../../api/data/use-get';
import { Link } from 'react-router-dom';
import RequestStatus from '../../components/RequestStatus';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  headerContainer: {
    display: 'flex',
    margin: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    margin: theme.spacing(1),
  },
  fieldsContainer: {
    marginTop: theme.spacing(2),
  },
}));

export default function EditCoursePage() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const { id } = useParams<any>();

  const { data: course, failed, loading, mutate } = useGet<Course>(
    `/course/${id}`
  );
  const [editCourse, setEditCourse] = useState<Course>({});

  const resCourse = { ...course, ...editCourse };
  const history = useHistory();

  const updateCourse = async () => {
    const { success, message, data } = await update(`/course/${id}`, resCourse);
    if (!success) {
      enqueueSnackbar(message ?? `Couldn't update "${resCourse.name}"!`);
    } else {
      enqueueSnackbar(message ?? `Updated course "${resCourse.name}"`);
      history.push(`/courses/${data._id}`);
      mutate(data);
    }
  };

  return (
    <div className={classes.root}>
      {course && (
        <>
          <div className={classes.headerContainer}>
            <Typography
              variant="h4"
              color="primary"
              style={{ fontWeight: 700 }}
            >
              Edit Course
            </Typography>
          </div>
          <div className={classes.fieldsContainer}>
            <CourseForm course={resCourse} setCourse={setEditCourse} />
          </div>
          <div className={classes.buttonContainer}>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              component={Link}
              to={`courses/${course._id}`}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={updateCourse}
            >
              Save
            </Button>
          </div>
        </>
      )}
      <RequestStatus
        failed={failed}
        loading={loading}
        failedMessage="Could not load course!"
      />
    </div>
  );
}
