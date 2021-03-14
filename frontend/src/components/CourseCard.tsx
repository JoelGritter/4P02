import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Course from '../api/data/models/course.model';

const useStyles = makeStyles({
  root: {},
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
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              color="primary"
              component="h5"
            >
              {course.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="h6">
              {course?.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default CourseCard;
