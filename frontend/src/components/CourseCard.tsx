import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Course from '../api/data/models/course.model';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 10,
    borderBottom: `4px solid #0055ff`,
    transition: '0.2s',
    '&:hover': {
      borderBottom: `4px solid #80aaff`,
      transition: '0.2s',
    },
  },
});

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
        <CardActionArea>
          <CardContent
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h5"
              color="primary"
              component="h5"
              align="center"
            >
              {course.name}
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              component="h6"
              align="center"
            >
              {course?.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default CourseCard;
