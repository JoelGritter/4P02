import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import { AssignmentForm } from '../../components/AssignmentForm';
import { post } from '../../api/util';
import Assignment from '../../api/data/models/assignment.model';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  headerContainer: {
    display: 'flex',
    margin: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {},
  button: {
    margin: theme.spacing(1),
  },
  fieldsContainer: {
    marginTop: theme.spacing(2),
  },
}));

export default function CreateAssignmentPage() {
  const { courseId }: { courseId: string } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [assignment, setAssignment] = useState<Assignment>({
    courseID: courseId,
  });
  const history = useHistory();

  const addAssignment = async () => {
    const { success, message, data } = await post('/assign', assignment);
    if (!success) {
      enqueueSnackbar(
        message ?? `Couldn't add "${assignment.name}" to your course!`
      );
    } else {
      enqueueSnackbar(message ?? `Added ${assignment.name} to your course!`);
      history.push(`/courses/${courseId}/assignments/${data._id}`);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <Typography variant="h4">Create Assignment</Typography>
        <div className={classes.buttonContainer}>
          <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            onClick={() => {
              setAssignment({
                courseID: courseId,
              });
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={addAssignment}
          >
            Create
          </Button>
        </div>
      </div>
      <div className={classes.fieldsContainer}>
        <AssignmentForm assignment={assignment} setAssignment={setAssignment} />
      </div>
    </div>
  );
}
