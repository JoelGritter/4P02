import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import useUsers from '../../api/data/use-users';
import { del, post } from '../../api/util';
import AdminCourses from './pages/AdminCourses';

function UserCard({ user, mutate }: any) {
  const { enqueueSnackbar } = useSnackbar();

  const isAdmin = user.roles?.includes('admin');
  const isProf = user.roles?.includes('prof');

  const adminHandler = async () => {
    if (isAdmin) {
      const { success, message } = await del('/user/admin', {
        cognitoId: user.cognitoId,
      });
      if (!success) {
        enqueueSnackbar(message);
      } else {
        enqueueSnackbar(message ?? `Removed ${user.email} as an admin`);
      }
    } else {
      const { success, message } = await post('/user/admin', {
        cognitoId: user.cognitoId,
      });
      if (!success) {
        enqueueSnackbar(message);
      } else {
        enqueueSnackbar(message ?? `Added ${user.email} as an admin`);
      }
    }
    mutate();
  };

  const profHandler = async () => {
    if (isProf) {
      const { success, message } = await del('/user/prof', {
        cognitoId: user.cognitoId,
      });
      if (!success) {
        enqueueSnackbar(message);
      } else {
        enqueueSnackbar(message ?? `Removed ${user.email} as a professor`);
      }
    } else {
      const { success, message } = await post('/user/prof', {
        cognitoId: user.cognitoId,
      });
      if (!success) {
        enqueueSnackbar(message);
      } else {
        enqueueSnackbar(message ?? `Added ${user.email} as a professor`);
      }
    }
    mutate();
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body1">{user.email}</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={isAdmin}
              onChange={adminHandler}
              name={`admin-${user.cognitoId}`}
              color="primary"
            />
          }
          label="Admin"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isProf}
              onChange={profHandler}
              name={`prof-${user.cognitoId}`}
              color="primary"
            />
          }
          label="Professor"
        />
      </CardContent>
    </Card>
  );
}

export default function AdminHome() {
  const { users, mutate } = useUsers();
  return (
    <>
      <Switch>
        <Route path="/admin/users">
          <Grid container spacing={1}>
            {users?.map((user) => (
              <Grid xs={12} item key={user.cognitoId}>
                <UserCard user={user} mutate={mutate}></UserCard>
              </Grid>
            ))}
          </Grid>
        </Route>
        <Route path="/admin/courses">
          <AdminCourses></AdminCourses>
        </Route>
        <Redirect to="/admin/users" />
      </Switch>
    </>
  );
}
