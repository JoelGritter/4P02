import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Submission from '../api/data/models/submission.model';
import moment from 'moment';

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
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent className={classes.contentContainer}>
        <Typography gutterBottom variant="h5" color="primary" component="h5">
          {submission._owner}
        </Typography>
        <Typography variant="h6" color="textSecondary">
          {moment(submission?.submissionDate).format('MMMM Do YYYY, h:mm:ss a')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SubmissionCard;
