import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Course from '../api/data/models/course.model';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    borderRadius: 10,
    borderBottom: `4px solid ${theme.palette.primary.main}`,
    transition: '0.2s',
    '&:hover': {
      borderBottom: `6px solid ${theme.palette.secondary.main}`,
      transition: '0.2s',
    },
  },
}));

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const classes = useStyles();

  return (
    <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
      <Card className={classes.root}>
        <CardActionArea>
          <CardContent
            style={{
              flexDirection: 'column',
            }}
          >
            <Typography variant="h5" color="primary" component="h5">
              {course.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="h6">
              {course?.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default CourseCard;
