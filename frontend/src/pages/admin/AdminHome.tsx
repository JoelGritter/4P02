import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import User from "../../api/data/models/user.model";
import useUsers from "../../api/data/use-users";
import { del, post } from "../../api/util";

function UserCard({ user, mutate }: any) {
  const { enqueueSnackbar } = useSnackbar();

  const isAdmin = user.roles?.includes("admin");

  const handler = async (event: any) => {
    if (isAdmin) {
      const {success, message} = await del("/user/admin", { cognitoId: user.cognitoId });
      console.log({success})
      if(!success) {
        enqueueSnackbar(message);
      }
    } else {
      const {success, message}  = await post("/user/admin", { cognitoId: user.cognitoId });
      console.log({success})
      if(!success) {
        enqueueSnackbar(message);
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
              onChange={handler}
              name={`admin-${user.cognitoId}`}
              color="primary"
            />
          }
          label="Admin"
        />
      </CardContent>
    </Card>
  );
}

export default function AdminHome() {
  const { users, mutate } = useUsers();
  return (
    <>
      <Grid container spacing={1}>
        {users?.map((user) => (
          <Grid xs={12} item key={user.cognitoId}>
            <UserCard user={user} mutate={mutate}></UserCard>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
