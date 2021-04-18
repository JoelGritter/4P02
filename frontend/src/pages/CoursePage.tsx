import React from 'react';
import { Link, useParams, Route } from 'react-router-dom';
import useGet from '../api/data/use-get';
import { Helmet } from 'react-helmet-async';
import Course from '../api/data/models/course.model';
import Assignment from '../api/data/models/assignment.model';
import RequestStatus from '../components/RequestStatus';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Grid,
  Breadcrumbs,
} from '@material-ui/core';
import AssignmentCard from '../components/AssignmentCard';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons/';
import useMe from '../api/data/use-me';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core/';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router';
import { del } from '../api/util';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerIcons: {
    float: 'right',
  },
  assignHeader: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  subHeader: {
    color: 'grey',
    marginTop: theme.spacing(1),
  },
  paper: {
    width: '80%',
    maxHeight: 435,
  },
  assignmentContainer: {},
  createCourseButton: {},
  breadCrumbs: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.54)',
  },
}));

export interface ConfirmationDialogRawProps {
  classes: Record<'paper', string>;
  id: string;
  keepMounted: boolean;
  open: boolean;
  onClose: (value?: boolean) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, open, ...other } = props;
  const radioGroupRef = React.useRef<HTMLElement>(null);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose(false);
  };

  const handleOk = () => {
    onClose(true);
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Confirm Deletion</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          Please confirm that you want to delete this course:
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function CoursesPage() {
  const { id } = useParams() as any;
  const {
    data: course,
    loading: loadingCourse,
    failed: failedCourse,
  } = useGet<Course>(`/course/${id}`);
  const {
    data: assignments,
    loading: loadingAssignments,
    failed: failedAssignments,
  } = useGet<Assignment | any>(`/assign/course/${id}`);

  const { isProf, isAdmin } = useMe();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);

  const handleDeleteButton = async () => {
    setOpen(true);
  };

  const deleteCourse = async () => {
    const { success, message } = await del(`/course/${course._id}`, course);
    if (!success) {
      enqueueSnackbar(message ?? `Couldn't delete "${course.name}"!`);
    } else {
      enqueueSnackbar(message ?? `Course "${course.name}" deleted!`);
      history.push(`/admin/courses`);
    }
  };

  const handleClose = (deleteConfirm?: boolean) => {
    setOpen(false);

    if (deleteConfirm) {
      deleteCourse();
    } else {
      enqueueSnackbar(`Deletion cancelled`);
    }
  };

  return (
    <>
      <Helmet>
        <title>uAssign - {course?.name || 'Course Loading...'}</title>
      </Helmet>
      <div className={classes.root}>
        {assignments && course && (
          <>
            <Grid item xs={12} md={9}>
              <div className={classes.root}>
                <Route>
                  {({ location }) => {
                    const pathnames = history.location.pathname
                      .split('/')
                      .filter((x) => x);

                    return (
                      <Breadcrumbs aria-label="breadcrumb">
                        <Link
                          color="inherit"
                          to="/"
                          className={classes.breadCrumbs}
                        >
                          Home
                        </Link>
                        {pathnames.map((value, index) => {
                          const last = index === pathnames.length - 1;
                          const to = `${pathnames.slice(index, index + 1)}`;

                          return last ? (
                            <Typography color="textPrimary" key={to}>
                              {to === course._id ? course.name : to}
                            </Typography>
                          ) : (
                            <Link
                              to={(location) => ({
                                ...location,
                                pathname: location.pathname.split(to)[0] + to,
                              })}
                              className={classes.breadCrumbs}
                            >
                              {to === course._id ? course.name : to}
                            </Link>
                          );
                        })}
                      </Breadcrumbs>
                    );
                  }}
                </Route>
              </div>
            </Grid>

            <div className={classes.header}>
              <Typography variant="h4">{course.name}</Typography>
              <div className={classes.headerIcons}>
                {isProf && (
                  <Tooltip title="Edit Course">
                    <IconButton
                      className={classes.createCourseButton}
                      component={Link}
                      to={`/courses/${id}/edit`}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {isAdmin && (
                  <>
                    <Tooltip title="Delete Course">
                      <IconButton
                        className={classes.createCourseButton}
                        component={IconButton}
                        color="primary"
                        onClick={() => {
                          handleDeleteButton();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <ConfirmationDialogRaw
                      classes={{
                        paper: classes.paper,
                      }}
                      id="delete-confirm-dialog"
                      keepMounted
                      open={open}
                      onClose={handleClose}
                    />
                  </>
                )}
              </div>
            </div>
            <Typography className={classes.subHeader}>
              {course.description}
            </Typography>
            <div className={classes.assignmentContainer}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h5" className={classes.assignHeader}>
                  Assignments
                </Typography>
                {isProf && (
                  <Tooltip title="Add Assignment">
                    <IconButton
                      className={classes.createCourseButton}
                      component={Link}
                      to={`/courses/${id}/assignments/create`}
                      color="primary"
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              {assignments.map((a: Assignment) => {
                return <AssignmentCard assignment={a} key={a._id} />;
              })}
            </div>
          </>
        )}
        <RequestStatus
          failed={failedCourse || failedAssignments}
          loading={loadingCourse || loadingAssignments}
          failedMessage="Could not load course!"
        />
      </div>
    </>
  );
}
