import React from "react";
import useUsers from "../../api/data/use-users";

export default function AdminHome() {
  const { users } = useUsers();
  return (
    <>
      <pre>{JSON.stringify(users)}</pre>
    </>
  );
}
