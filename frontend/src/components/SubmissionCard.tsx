import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  Card,
  CardActions,
  Collapse,
  Divider,
  Grid,
  TextField,
} from '@material-ui/core/';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Submission from '../api/data/models/submission.model';
import moment from 'moment';
import useGet from '../api/data/use-get';
import User from '../api/data/models/user.model';
import { post, update } from '../api/util';
import { useSnackbar } from 'notistack';
import Assignment from '../api/data/models/assignment.model';
import TestCases from './TestCases';

const useStyles = makeStyles((theme) => ({
  root: {},
  contentContainer: {},
  cardDate: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    },
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
}));

interface SubmissionCardProps {
  assignment: Assignment;
  submission: Submission;
  mutateSubmission?: any;
  courseID: String;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({
  assignment,
  submission,
  mutateSubmission,
  courseID,
}) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();
  const [showFeedback, setFeedback] = React.useState(false);
  const [newSub, setSubmission] = React.useState(submission);
  const [edit, setEdit] = React.useState(false);

  const handleFormChange = (event: any) => {
    const value = event.target.value;
    const name = event.target.name;

    setSubmission((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { data: submissionUser } = useGet<User>(
    `/user/public/${submission?.owner}`
  );

  return (
    <Card className={classes.root}>
      <CardContent className={classes.contentContainer}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="textPrimary" component="h6">
              {submissionUser?.name}
            </Typography>
            <Typography gutterBottom variant="body2" color="textSecondary">
              {submissionUser?.email}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.cardDate}>
            <Typography variant="body1" color="textSecondary">
              {moment(submission?.submissionDate).format(
                'MMMM Do YYYY, h:mm A'
              )}
            </Typography>
          </Grid>
        </Grid>
        <TestCases
          assignment={assignment}
          submission={submission}
          mutateSub={mutateSubmission}
        />
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={async () => {
            const { data, success, message } = await post(
              'fileGetUrl/submission',
              {
                assignmentId: submission.assignID,
                courseId: courseID,
                objectKey: submission.codeZip,
                cognitoId: submission.owner,
              }
            );

            if (success) {
              const { signedUrl } = data;
              window.open(signedUrl, '_blank');
            } else {
              enqueueSnackbar(message ?? 'Unknown error downloading file!');
            }
          }}
        >
          Download {submission.codeZip}
        </Button>
        {!showFeedback && (
          <Button
            variant="outlined"
            color="primary"
            onClick={async () => {
              setFeedback(true);
            }}
          >
            Feedback
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
                  value={newSub.feedback}
                  variant="outlined"
                  name="feedback"
                  label="Feedback"
                  onChange={handleFormChange}
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  name="grade"
                  label="Grade"
                  value={newSub.grade}
                  onChange={handleFormChange}
                  disabled={!edit}
                />
              </Grid>
            </Grid>
            <Box className={classes.feedbackActions}>
              {edit && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={async () => {
                    const { success, message } = await update(
                      `/assign/sub/${submission.assignID}`,
                      newSub
                    );

                    if (success) {
                      enqueueSnackbar(message ?? 'Feedback submitted!');
                    } else {
                      enqueueSnackbar(
                        message ?? 'Unknown error submitting feedback!'
                      );
                    }

                    setEdit(false);
                  }}
                >
                  Save
                </Button>
              )}
              {!edit && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  Edit
                </Button>
              )}
              {edit && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setEdit(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </CardContent>
        </>
      </Collapse>
    </Card>
  );
};

export default SubmissionCard;
