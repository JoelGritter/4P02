import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardActions, Grid, TextField } from '@material-ui/core/';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Submission from '../api/data/models/submission.model';
import moment from 'moment';
import useGet from '../api/data/use-get';
import User from '../api/data/models/user.model';
import { post, update } from '../api/util';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {},
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  cardDate: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    },
  },
}));

interface SubmissionCardProps {
  submission: Submission;
  courseID: String;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  courseID,
}) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();
  const [showFeedback, setFeedback] = React.useState(false);
  const [newSub, setSubmission] = React.useState(submission);

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
        <Button
          variant="outlined"
          color="primary"
          onClick={async () => {
            setFeedback(true);
          }}
        >
          Give Feedback
        </Button>
      </CardActions>
      {showFeedback && (
        <CardActions>
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
              />
            </Grid>
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
              }}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={async () => {
                setFeedback(false);
              }}
            >
              Cancel
            </Button>
          </Grid>
        </CardActions>
      )}
    </Card>
  );
};

export default SubmissionCard;
