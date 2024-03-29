import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Assignment from '../api/data/models/assignment.model';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '15px 5px',
    borderRadius: 10,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    transition: '0.2s',
    '&:hover': {
      borderLeft: `8px solid ${theme.palette.secondary.main}`,
      transition: '0.2s',
    },
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

interface AssignmentCardProps {
  assignment: Assignment;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  const classes = useStyles();

  return (
    <Link
      to={`/courses/${assignment.courseID}/assignments/${assignment._id}`}
      style={{ textDecoration: 'none' }}
    >
      <Card className={classes.root} elevation={5}>
        <CardActionArea>
          <CardContent className={classes.contentContainer}>
            <Typography
              variant="h5"
              color="initial"
              component="h5"
              style={{ color: 'black' }}
            >
              {assignment.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="h6">
              {moment(assignment?.closeDate).format('DD-MM-YYYY')}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default AssignmentCard;
