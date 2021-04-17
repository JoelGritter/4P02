import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card } from '@material-ui/core/';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Submission from '../api/data/models/submission.model';
import moment from 'moment';
import useGet from '../api/data/use-get';
import User from '../api/data/models/user.model';
import { post } from '../api/util';

const useStyles = makeStyles({
  root: {
    margin: 5,
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

interface SubmissionCardProps {
  submission: Submission;
  courseID: String;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  courseID,
}) => {
  const classes = useStyles();

  const { data: submissionUser } = useGet<User>(
    `/user/public/${submission?.owner}`
  );

  return (
    <Card className={classes.root}>
      <CardContent className={classes.contentContainer}>
        <Typography gutterBottom variant="h5" color="primary" component="h5">
          {submissionUser?.name}
        </Typography>
        <Typography variant="h6" color="textSecondary">
          {moment(submission?.submissionDate).format('MMMM Do YYYY, h:mm:ss a')}
        </Typography>
      </CardContent>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          const {
            data: { signedUrl },
          } = await post('fileGetUrl', {
            assignmentId: submission.assignID,
            courseId: courseID,
            objectKey: submission.codeZip,
          });

          window.open(signedUrl, '_blank');
        }}
      >
        Download {submission.codeZip}
      </Button>
    </Card>
  );
};

export default SubmissionCard;
