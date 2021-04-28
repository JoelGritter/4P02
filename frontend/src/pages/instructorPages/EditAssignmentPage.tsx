import React, { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import { put } from '../../api/util';
import { useHistory, useParams } from 'react-router';
import useGet from '../../api/data/use-get';
import { Link } from 'react-router-dom';
import RequestStatus from '../../components/RequestStatus';
import Assignment, {
  emptyAssignment,
} from '../../api/data/models/assignment.model';
import AssignmentForm from '../../components/AssignmentForm';

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
    marginTop: theme.spacing(3),
  },
}));

export default function EditCoursePage() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const { courseId, id } = useParams<any>();

  const { data: assignment, loading, failed, mutate } = useGet<
    Assignment | any
  >(`/assign/${id}`);
  const [editAssignment, setEditAssignment] = useState<Assignment>(
    emptyAssignment
  );

  useEffect(() => {
    setEditAssignment((prev) => ({
      ...prev,
      ...assignment,
    }));
  }, [assignment]);

  const resAssignment = editAssignment;
  const history = useHistory();

  const updateAssignment = async () => {
    const { success, message, data } = await put(
      `/assign/${id}`,
      resAssignment
    );
    if (!success) {
      enqueueSnackbar(message ?? `Couldn't update "${resAssignment.name}"!`);
    } else {
      enqueueSnackbar(message ?? `Updated Assignment "${resAssignment.name}"`);
      history.push(`/courses/${courseId}/assignments/${id}`);
      mutate(data);
    }
  };

  return (
    <div className={classes.root}>
      {assignment && (
        <>
          <div className={classes.headerContainer}>
            <Typography variant="h4">Edit Assignment</Typography>
          </div>
          <div className={classes.fieldsContainer}>
            <AssignmentForm
              assignment={resAssignment}
              setAssignment={setEditAssignment}
            />
          </div>
          <div className={classes.buttonContainer}>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              component={Link}
              to={`/courses/${assignment.courseID}/assignments/${assignment._id}`}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={updateAssignment}
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
