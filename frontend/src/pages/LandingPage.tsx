import { Button } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <>
      Ahh yes home page
      <Button component={Link} to="/login">
        Login
      </Button>
    </>
  );
}
