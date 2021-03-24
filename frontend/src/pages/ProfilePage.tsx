import {
  Button,
  createStyles,
  TextField,
  Card,
  CardContent,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import useMe from '../api/data/use-me';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { update } from '../api/util';
import { useState } from 'react';
import User from '../api/data/models/user.model';
import { useSnackbar } from 'notistack';

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
      marginTop: theme.spacing(2),
    },
    card: {
      marginTop: theme.spacing(2),
    },
    p: {
      marginTop: theme.spacing(1),
      height: '14px',
    },
  })
);
export default function ProfilePage() {
  const classes = useStyles();
  const { me, mutate } = useMe();
  const { enqueueSnackbar } = useSnackbar();

  //Getter, setter
  const [user, setUser] = useState<User>({} as any);

  const [edit, setEdit] = useState<boolean>(false);

  const resUser = { ...me, ...user };

  const userHandler = async () => {
    const { success, message, data } = await update('user/me', resUser);
    if (!success) {
      enqueueSnackbar(message ?? `Couldn't make changes"`);
    } else {
      enqueueSnackbar(message ?? `Sucessfully updated profile!`);
    }
    mutate(data);
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
      {!edit && (
        <>
          <div className={classes.headerContainer}>
            <Typography variant="h4">Profile</Typography>
            <div>
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={() => {
                  setEdit(true);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
          <Grid item alignItems="stretch" xs={12} spacing={1}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5">Name Settings</Typography>
                <p className={classes.p}>Name: {me?.name}</p>
              </CardContent>
            </Card>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5">Email Settings</Typography>
                <p className={classes.p}>Email: {me?.email}</p>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
      {edit && (
        <>
          <div className={classes.headerContainer}>
            <Typography variant="h4">Profile</Typography>
            <div>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => {
                  userHandler();
                  setEdit(false);
                }}
              >
                Save
              </Button>
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={() => {
                  setEdit(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
          <Grid item alignItems="stretch" xs={12} spacing={1}>
            <Card style={{ width: '100%' }}>
              <CardContent>
                <Typography variant="h5">Name Settings</Typography>
                <p className={classes.p}>Name: {me?.name}</p>
                <div>
                  <TextField
                    className={classes.fieldsContainer}
                    variant="outlined"
                    color="primary"
                    label="New Name"
                    name="name"
                    placeholder={me?.name}
                    onChange={textHandler}
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </>
  );
}
