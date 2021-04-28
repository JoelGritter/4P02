import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import { CourseForm } from '../../components/CourseForm';
import { post } from '../../api/util';
import Course, { emptyCourse } from '../../api/data/models/course.model';
import { useHistory } from 'react-router';

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

export default function CreateCoursePage() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [course, setCourse] = useState<Course>(emptyCourse);
  const history = useHistory();

  const addCourse = async () => {
    const { success, message, data } = await post('/course', course);
    if (!success) {
      enqueueSnackbar(
        message ?? `Couldn't add "${course.name}" to your courses!`
      );
    } else {
      enqueueSnackbar(message ?? `Added ${course.name} to your courses!`);
      history.push(`/courses/${data._id}`);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <Typography variant="h4" color="primary" style={{ fontWeight: 700 }}>
          Create Course
        </Typography>
      </div>
      <div className={classes.fieldsContainer}>
        <CourseForm course={course} setCourse={setCourse} />
      </div>
      <div className={classes.buttonContainer}>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={() => {
            setCourse(emptyCourse);
          }}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={addCourse}
        >
          Create
        </Button>
      </div>
    </div>
  );
}
