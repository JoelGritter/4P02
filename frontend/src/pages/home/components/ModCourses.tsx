import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import useAssociatedCourses from '../../../api/data/use-associated-courses';
import CourseCard from '../../../components/CourseCard';
import RequestStatus from '../../../components/RequestStatus';

const useStyles = makeStyles((theme: Theme) => ({
  innerCoursesContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default function ModCourses() {
  const classes = useStyles();
  const { modCourses, loading, failed } = useAssociatedCourses();

  return (
    <>
      {modCourses && modCourses.length > 0 && (
        <>
          <Box display="flex" justifyContent="space-between" paddingRight={1}>
            <Typography variant="h4">My TA Courses</Typography>
          </Box>
          <Grid container spacing={1} className={classes.innerCoursesContainer}>
            {modCourses.map((course) => {
              return (
                <Grid item xs={12} key={course._id}>
                  <CourseCard course={course} />
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
      <RequestStatus
        loading={loading}
        failed={failed}
        failedMessage="Failed to load courses!"
      />
    </>
  );
}
