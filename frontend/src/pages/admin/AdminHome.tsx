import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@material-ui/core";
import React from "react";
import User from "../../api/data/models/user.model";
import useUsers from "../../api/data/use-users";

function UserCard({ user }: { user: User }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body1">{user.email}</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={user.roles?.includes("admin")}
              onChange={() => {}}
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
  const { users } = useUsers();
  return (
    <>
      {users?.map((user) => (
        <UserCard user={user} key={user.cognitoId}></UserCard>
      ))}
    </>
  );
}
