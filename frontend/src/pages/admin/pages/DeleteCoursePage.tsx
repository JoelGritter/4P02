import { makeStyles, Theme } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router';
import useGet from '../../../api/data/use-get';
import Course from '../../../api/data/models/course.model';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import useMe from '../../../api/data/use-me';
import { del } from '../../../api/util';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

export default function DeleteCoursePage() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams<any>();
  const { isAdmin } = useMe();
  const history = useHistory();

  const { data: course } = useGet<Course>(`/course/${id}`);

  const deleteCourse = async () => {
    const { success, message } = await del(`/course/${course._id}`, course);
    if (!success) {
      enqueueSnackbar(message ?? `Couldn't delete "${course.name}"!`);
    } else {
      enqueueSnackbar(message ?? `Course "${course.name}" deleted!`);
      history.push(`/admin/courses`);
    }
  };

  return (
    <div className={classes.root}>
      {course && isAdmin && (
        <>
          <Typography variant="h3">
            Confirm deletion of course "{course.name}":
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              history.push(`/courses/${course._id}`);
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              deleteCourse();
            }}
          >
            Confirm
          </Button>
        </>
      )}
    </div>
  );
}
