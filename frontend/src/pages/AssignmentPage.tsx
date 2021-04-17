import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Link, useParams } from 'react-router-dom';
import useGet from '../api/data/use-get';
import Assignment from '../api/data/models/assignment.model';
import Submission, {
  emptySubmission,
} from '../api/data/models/submission.model';
import { Helmet } from 'react-helmet-async';
import Typography from '@material-ui/core/Typography';
import { Box, Button, Link as MatLink } from '@material-ui/core';
import RequestStatus from '../components/RequestStatus';
import moment from 'moment';
import Course from '../api/data/models/course.model';
import { useSnackbar } from 'notistack';
import { putFile, put, post } from '../api/util';
import useMe from '../api/data/use-me';
import TestCases from '../components/TestCases';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  assignHeader: {},
  subHeader: {
    marginBottom: theme.spacing(1),
  },
  dueContainer: {},
  createCourseButton: {
    height: 75,
  },
}));

export default function AssignmentPage() {
  const classes = useStyles();
  const { courseId, id }: { courseId: string; id: string } = useParams();
  const {
    data: assignment,
    loading: loadingAssign,
    failed: failedAssign,
  } = useGet<Assignment>(`/assign/${id}`);
  const {
    data: course,
    loading: loadingCourse,
    failed: failedCourse,
  } = useGet<Course>(`course/${courseId}`);

  const { isProf } = useMe();
  return (
    <div className={classes.root}>
      {assignment && course && (
        <>
          <Helmet>
            <title>uAssign - {assignment?.name || 'Course Loading...'}</title>
          </Helmet>
          <Typography
            variant="body1"
            color="textSecondary"
            className={classes.subHeader}
          >
            <MatLink component={Link} to={`/courses/${courseId}`}>
              {course?.name}
            </MatLink>
          </Typography>
          <div className={classes.header}>
            <Typography variant="h4">{assignment.name}</Typography>
            {isProf && (
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
          </div>
          {!isProf && <StudentAssignmentPage />}
        </>
      )}
      <RequestStatus
        loading={loadingAssign || loadingCourse}
        failed={failedAssign || failedCourse}
        failedMessage={'Failed to load'}
      ></RequestStatus>
    </div>
  );
}

function StudentAssignmentPage() {
  const { courseId, id }: { courseId: string; id: string } = useParams();
  const { data: assignment } = useGet<Assignment>(`/assign/${id}`);
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(new File([], 'null'));
  const [submission] = useState<Submission>(emptySubmission);
  const { data: course } = useGet<Course>(`course/${courseId}`);
  const { data: oldSub, mutate: mutateSub } = useGet<Submission>(
    `assign/sub/${id}`
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

      const {
        data: { signedUrl },
        success: signedSuccess,
        message: signedMessage,
      } = await post('filePutUrl', {
        assignmentId: assignment._id,
        courseId,
        objectKey: file.name,
        contentType: file.type,
      });

      if (!signedSuccess) {
        enqueueSnackbar(
          signedMessage ?? `Could not upload ${file.name} to the server!`
        );
        return;
      }

      const { success: postSuccess } = await putFile(signedUrl, file);

      if (!postSuccess) {
        enqueueSnackbar(`Could not upload ${file.name} to the server!`);
        return;
      }

      const { success, message } = await put(`/assign/sub/${id}`, submission);
      if (!success) {
        // enqueueSnackbar(
        //   message ?? `Could not complete submission for ${assignment.name}!`
        // );
        // const { success: delSuccess } = await deleteFile(
        //   `/s3/submissions/${courseId}/${id}/${user.cognitoId}/${file.name}`,
        //   file
        // );
      } else {
        enqueueSnackbar(
          message ?? `Successfully completed submission for ${assignment.name}!`
        );
        mutateSub();
      }
    }
  };

  return (
    <>
      {oldSub && assignment && assignment._id && (
        <>
          <Box marginTop={1}>
            <Typography variant="body1">
              Submission made on{' '}
              {moment(oldSub?.submissionDate).format('LL - h:mm a')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              File submitted -{' '}
              <Button
                onClick={async () => {
                  const {
                    data: { signedUrl },
                  } = await post('fileGetUrl', {
                    assignmentId: assignment._id,
                    courseId: course._id,
                    objectKey: oldSub.codeZip,
                  });

                  window.open(signedUrl, '_blank');
                }}
              >
                {oldSub.codeZip}
              </Button>
            </Typography>
          </Box>
          <TestCases
            assignment={assignment}
            submission={oldSub}
            mutateSub={mutateSub}
          />
        </>
      )}

      {new Date(assignment.closeDate).getTime() > new Date().getTime() &&
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
    </>
  );
}
