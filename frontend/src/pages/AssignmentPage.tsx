import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Link, useParams } from 'react-router-dom';
import useGet from '../api/data/use-get';
import Assignment from '../api/data/models/assignment.model';
import User from '../api/data/models/user.model';
import Submission, {
  emptySubmission,
} from '../api/data/models/submission.model';
import { Helmet } from 'react-helmet-async';
import Typography from '@material-ui/core/Typography';
import { Box, Button } from '@material-ui/core';
import RequestStatus from '../components/RequestStatus';
import moment from 'moment';
import Course from '../api/data/models/course.model';
import { useSnackbar } from 'notistack';
import { putFile, deleteFile, put } from '../api/util';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assignHeader: {},
  subHeader: {
    color: 'grey',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  dueContainer: {},
  createCourseButton: {
    height: 75,
  },
}));

export default function AssignmentPage() {
  const { courseId, id }: { courseId: string; id: string } = useParams();
  const {
    data: assignment,
    loading: loadingAssign,
    failed: failedAssign,
  } = useGet<Assignment>(`/assign/${id}`);
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(new File([], 'null'));
  const [submission] = useState<Submission>(emptySubmission);
  const { data: course } = useGet<Course>(`course/${courseId}`);
  const { data: oldSub } = useGet<any>(`assign/sub/${id}`);
  const classes = useStyles();
  const { data: user, loading: loadingUser, failed: failedUser } = useGet<User>(
    `/user/me`
  );

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const sendSubmission = async () => {
    if (file.size === 0) {
      enqueueSnackbar(`No file selected to submit!`);
    } else if (!file.type.includes('zip')) {
      enqueueSnackbar(`File must be a zip file!`);
    } else {
      submission.codeZip = file.name;

      const { success: postSuccess } = await putFile(
        `/s3/submissions/${courseId}/${id}/${user.cognitoId}/${file.name}`,
        file
      );

      if (!postSuccess) {
        enqueueSnackbar(`Could not upload ${file.name} to the server!`);
        return;
      }

      const { success, message } = await put(`/assign/sub/${id}`, submission);
      if (!success) {
        enqueueSnackbar(
          message ?? `Could not complete submission for ${assignment.name}!`
        );
        const { success: delSuccess } = await deleteFile(
          `/s3/submissions/${courseId}/${id}/${user.cognitoId}/${file.name}`,
          file
        );
        console.log(delSuccess);
      } else {
        enqueueSnackbar(
          message ?? `Successfully completed submission for ${assignment.name}!`
        );
        window.location.reload(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>uAssign - {assignment?.name || 'Course Loading...'}</title>
      </Helmet>
      <div className={classes.root}>
        {assignment && user && oldSub && course && (
          <>
            <div className={classes.header}>
              <Typography variant="h4">{assignment.name}</Typography>
              {course?.currentProfessors?.includes(user.cognitoId) && (
                <Button
                  component={Link}
                  to={`/courses/${courseId}/assignments/${id}/edit`}
                  variant="contained"
                  color="primary"
                >
                  Edit Assignment
                </Button>
              )}
            </div>
            <Typography className={classes.subHeader}>
              {course?.name}
            </Typography>
            <div className={classes.dueContainer}>
              <Typography variant="body1" color="textSecondary">
                Open Date
              </Typography>
              <Typography variant="body1">
                {moment(assignment?.openDate).format('LL - h:mm a')}
              </Typography>
              <Box marginTop={1}>
                <Typography variant="body1" color="textSecondary">
                  Due Date
                </Typography>
                <Typography variant="body1">
                  {moment(assignment?.lateDate ?? assignment?.closeDate).format(
                    'LL - h:mm a'
                  )}
                </Typography>
              </Box>
              {assignment?.lateDate && (
                <>
                  <Box marginTop={1}>
                    <Typography variant="body1" color="textSecondary">
                      Late Due
                    </Typography>
                    <Typography variant="body1">
                      {moment(assignment?.closeDate).format('LL - h:mm a')}
                    </Typography>
                  </Box>
                </>
              )}

              {oldSub.length !== 0 && (
                <>
                  <Box marginTop={1}>
                    <Typography variant="body1">
                      {' '}
                      Submission made on{' '}
                      {moment(oldSub[0]?.submissionDate).format('LL - h:mm a')}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {' '}
                      File submitted - {oldSub[0]?.codeZip}
                    </Typography>
                  </Box>
                </>
              )}

              {new Date(assignment.closeDate).getTime() >
                new Date().getTime() &&
                !user.roles?.includes('prof') &&
                oldSub && (
                  <>
                    <Box marginTop={1}>
                      <input
                        type="file"
                        name="chooseFile"
                        onChange={handleFileChange}
                      />

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={sendSubmission}
                      >
                        Submit
                      </Button>
                    </Box>
                  </>
                )}

              <Box marginTop={1}>
                <Button
                  component={Link}
                  to={`/courses/${courseId}`}
                  variant="contained"
                  color="primary"
                >
                  Back to Course
                </Button>
              </Box>
            </div>
          </>
        )}
        <RequestStatus
          failed={failedAssign || failedUser}
          loading={loadingAssign || loadingUser}
          failedMessage="Could not load course!"
        />
      </div>
    </>
  );
}
