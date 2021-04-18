import {
  Button,
  createStyles,
  TextField,
  Breadcrumbs,
  Typography,
  Grid,
} from '@material-ui/core';
import React from 'react';
import useMe from '../api/data/use-me';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { update } from '../api/util';
import { useState } from 'react';
import User from '../api/data/models/user.model';
import { useSnackbar } from 'notistack';
import RequestStatus from '../components/RequestStatus';
import { Route, useHistory } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    headerContainer: {
      display: 'flex',
      margin: theme.spacing(1),
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    fieldsContainer: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(1),
    },
    breadCrumbs: {
      textDecoration: 'none',
      color: 'rgba(0, 0, 0, 0.54)',
    },
  })
);
export default function ProfilePage() {
  const classes = useStyles();
  const history = useHistory();
  const pathnames = history.location.pathname.split('/').filter((x) => x);
  const { me, mutate, loading, failed, success } = useMe();
  const { enqueueSnackbar } = useSnackbar();

  //Getter, setter
  const [user, setUser] = useState<User>({} as any);

  const [manualEdit, setManualEdit] = useState<boolean>(false);
  const incomplete = success && !me.name;
  const edit = manualEdit || incomplete;

  const resUser = { ...me, ...user };

  const userHandler = async () => {
    const { success, message, data } = await update('user/me', resUser);
    if (!success) {
      enqueueSnackbar(message ?? `Couldn't make changes"`);
    } else {
      enqueueSnackbar(message ?? `Successfully updated profile!`);
      mutate(data);
      setManualEdit(false);
    }
  };

  const textHandler = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    setUser((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <RequestStatus
        loading={loading}
        failed={failed}
        failedMessage="Failed to load profile!"
      />
      <Grid item xs={12} md={9}>
        <Route>
          <Breadcrumbs aria-label="breadcrumb">
            <RouterLink
              color="textSecondary"
              to="/"
              className={classes.breadCrumbs}
            >
              Home
            </RouterLink>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `${pathnames.slice(index, index + 1)}`;

              return last ? (
                <Typography color="textPrimary" key={to}>
                  {to}
                </Typography>
              ) : (
                <RouterLink
                  to={(location) => ({
                    ...location,
                    pathname: location.pathname.split(to)[0] + to,
                  })}
                  key={to}
                  className={classes.breadCrumbs}
                >
                  {to}
                </RouterLink>
              );
            })}
          </Breadcrumbs>
        </Route>
      </Grid>
      <div className={classes.headerContainer}>
        {incomplete && <Typography variant="h4">Complete Profile</Typography>}
        {!incomplete && <Typography variant="h4">Profile</Typography>}
        <div>
          {!edit && (
            <>
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={() => {
                  setManualEdit(true);
                }}
              >
                Edit
              </Button>
            </>
          )}

          {edit && (
            <>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={userHandler}
              >
                Save
              </Button>
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={() => {
                  setManualEdit(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
      {incomplete && (
        <Typography className={classes.headerContainer} variant="body1">
          You need to complete your profile before proceeding!
        </Typography>
      )}

      <Grid container spacing={2} className={classes.fieldsContainer}>
        {!edit && (
          <>
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1" color="textPrimary">
                {me?.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary">
                Name
              </Typography>
              <Typography variant="body1" color="textPrimary">
                {me?.name}
              </Typography>
            </Grid>
          </>
        )}
        {edit && (
          <>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                color="primary"
                label="Email"
                disabled
                name="email"
                value={resUser?.email}
                onChange={textHandler}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                color="primary"
                label="Name"
                name="name"
                value={resUser?.name}
                onChange={textHandler}
                fullWidth
              />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}
