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
import { Box, Button, Divider, Grid } from '@material-ui/core';
import RequestStatus from '../components/RequestStatus';
import moment from 'moment';
import Course from '../api/data/models/course.model';
import { useSnackbar } from 'notistack';
import { putFile, put, post } from '../api/util';
import useMe from '../api/data/use-me';
import TestCases from '../components/TestCases';
import SubmissionCard from '../components/SubmissionCard';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  description: {
    marginBottom: theme.spacing(2),
  },
  assignHeader: {},
  subHeader: {
    marginBottom: theme.spacing(1),
  },
  dueContainer: {
    marginTop: theme.spacing(2),
  },
  createCourseButton: {
    height: 75,
  },
  submissionCardContainer: {
    marginTop: theme.spacing(1),
  },
  submissionsHeader: {
    marginTop: theme.spacing(2),
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

  const { isProf, isAdmin, me } = useMe();
  const hasEditAccess = isProf || isAdmin;
  const isCourseStudent = course?.students?.includes(me?.cognitoId);
  return (
    <div className={classes.root}>
      {assignment && course && (
        <>
          <Helmet>
            <title>uAssign - {assignment?.name || 'Course Loading...'}</title>
          </Helmet>
          <div className={classes.header}>
            <Typography variant="h4">{assignment.name}</Typography>
            {hasEditAccess && (
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
          <div className={classes.description}>
            <Typography variant="body1" color="textPrimary">
              {assignment?.description}
            </Typography>
          </div>
          <Divider />
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
          {isCourseStudent && <StudentAssignmentPage />}
          {hasEditAccess && <ProfAssignmentPage />}
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

function ProfAssignmentPage() {
  const { courseId, id }: { courseId: string; id: string } = useParams();
  const { data: submissions } = useGet<Submission[]>(
    `/assign/submissions/${id}/`
  );

  const classes = useStyles();

  return (
    <>
      {submissions && (
        <>
          <Typography variant="h5" className={classes.submissionsHeader}>
            Submissions
          </Typography>
          <Grid
            container
            spacing={2}
            className={classes.submissionCardContainer}
          >
            {submissions?.map((s: Submission) => {
              return (
                <Grid item xs={12} key={s._id}>
                  <SubmissionCard submission={s} courseID={courseId} />
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </>
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
    `assign/sub/${id}`,
    {
      shouldRetryOnError: false,
    }
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
      } = await post('filePutUrl/submission', {
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
                  const { data, success, message } = await post(
                    'fileGetUrl/submission',
                    {
                      assignmentId: assignment._id,
                      courseId: course._id,
                      objectKey: oldSub.codeZip,
                    }
                  );

                  if (success) {
                    const { signedUrl } = data;
                    window.open(signedUrl, '_blank');
                  } else {
                    enqueueSnackbar(
                      message ?? 'Unknown error downloading file'
                    );
                  }
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

      {new Date(assignment.closeDate).getTime() > new Date().getTime() && (
        <>
          <Box marginTop={1}>
            <input type="file" name="chooseFile" onChange={handleFileChange} />

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
