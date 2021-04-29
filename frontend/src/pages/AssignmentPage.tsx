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
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Collapse,
  TextField,
  Link as MatLink,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import RequestStatus from '../components/RequestStatus';
import moment from 'moment';
import Course from '../api/data/models/course.model';
import { useSnackbar } from 'notistack';
import { putFile, put, post } from '../api/util';
import useMe from '../api/data/use-me';
import TestCases from '../components/TestCases';
import SubmissionCard from '../components/SubmissionCard';
import EditIcon from '@material-ui/icons/Edit';

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
    fontWeight: 700,
    marginTop: theme.spacing(2),
  },
  card: {
    marginTop: theme.spacing(2),
  },
  feedbackContent: {},
  feedbackActions: {
    '& > button': {
      marginRight: theme.spacing(1),
    },
    marginTop: theme.spacing(2),
  },
  feedbackDivider: {
    marginTop: theme.spacing(2),
  },
  icon: {
    backgroundColor: theme.palette.background.paper,
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
  const isCourseMod = course?.moderators?.includes(me?.cognitoId);

  return (
    <div className={classes.root}>
      {assignment && course && (
        <>
          <Helmet>
            <title>
              UAssign - {assignment?.name || 'Assignment Loading...'}
            </title>
          </Helmet>
          <div className={classes.header}>
            <Typography
              variant="h4"
              style={{ fontWeight: 700 }}
              color="primary"
            >
              {assignment.name}
            </Typography>
            {hasEditAccess && (
              <div>
                <Tooltip title="Edit Assignment">
                  <IconButton
                    component={Link}
                    className={classes.icon}
                    to={`/courses/${courseId}/assignments/${id}/edit`}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
          <div className={classes.description}>
            <Typography variant="body1" color="textPrimary">
              {assignment?.description}
            </Typography>
          </div>
          <Divider />
          <div className={classes.dueContainer}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" color="textSecondary">
                  Open Date
                </Typography>
                <Typography variant="body1">
                  {moment(assignment?.openDate).format('LL - h:mm a')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" color="textSecondary">
                  Due Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {moment(assignment?.lateDate ?? assignment?.closeDate).format(
                    'LL - h:mm a'
                  )}
                </Typography>
              </Grid>
            </Grid>
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
          {(hasEditAccess || isCourseMod) && <ProfAssignmentPage />}
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
  const [showFeedback, setFeedback] = React.useState(false);
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

  const classes = useStyles();

  return (
    <>
      {oldSub && assignment && assignment._id && (
        <>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Your Submission
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Submitted on{' '}
                {moment(oldSub?.submissionDate).format('LL - h:mm a')}
              </Typography>
              <TestCases
                assignment={assignment}
                submission={oldSub}
                mutateSub={mutateSub}
              />
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                color="primary"
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
                Download Submission ({oldSub.codeZip})
              </Button>
              {!showFeedback && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={async () => {
                    setFeedback(true);
                  }}
                >
                  View Feedback
                </Button>
              )}
              {showFeedback && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={async () => {
                    setFeedback(false);
                  }}
                >
                  Hide Feedback
                </Button>
              )}
            </CardActions>
            <Collapse in={showFeedback}>
              <>
                <Divider className={classes.feedbackDivider} />
                <CardContent className={classes.feedbackContent}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={oldSub.feedback}
                        variant="outlined"
                        name="feedback"
                        label="Feedback"
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <TextField
                        fullWidth
                        type="number"
                        variant="outlined"
                        name="grade"
                        label="Grade"
                        value={oldSub.grade}
                        disabled={true}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </>
            </Collapse>
          </Card>
        </>
      )}

      {new Date(assignment.closeDate).getTime() > new Date().getTime() && (
        <>
          <Box marginTop={2}>
            <Typography variant="h5" gutterBottom>
              {oldSub ? 'Resubmit' : 'Submit'}
            </Typography>
            <Typography gutterBottom color="textSecondary">
              See{' '}
              <MatLink to="/help" component={Link}>
                submission instructions
              </MatLink>{' '}
              for help
            </Typography>
            <input type="file" name="chooseFile" onChange={handleFileChange} />

            <Button variant="outlined" color="primary" onClick={sendSubmission}>
              Submit
            </Button>
          </Box>
        </>
      )}
    </>
  );
}
