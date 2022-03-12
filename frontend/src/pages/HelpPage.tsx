import React from 'react';
import {
  Button,
  createStyles,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headers: {
      marginBottom: theme.spacing(1),
      fontWeight: 700,
    },
    fieldsContainer: {
      marginTop: theme.spacing(1),
    },
    supportButton: {
      fontWeight: 700,
      fontSize: '14px',
      color: '#fff',
      marginTop: '15px',
      backgroundColor: theme.palette.primary.main,
      borderRadius: 50,
      padding: '8px 30px',
      '&:hover': {
        backgroundColor: '#6699ff',
        transition: '0.5s',
      },
      textAlign: 'center',
    },
  })
);

export default function HelpPage() {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h4" color="primary" style={{ fontWeight: 700 }}>
        Help
      </Typography>
      <Grid container spacing={2} className={classes.fieldsContainer}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            color="textPrimary"
            className={classes.headers}
          >
            Submission Instructions
          </Typography>
          <p>
            For assignment submissions you will have to provide a zip file
            containing your code, along with a compile_and_run.sh script
            containing instructions how your program can be compiled.
            <br />
            We have provided examples of compile_and_run.sh scripts for the
            languages supported on this platform.
          </p>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="body1"
            color="textSecondary"
            className={classes.headers}
          >
            Java
          </Typography>
          <code>
            touch out.txt <br />
            javac Main.java <br />
            {`java Main > out.txt`}
          </code>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="body1"
            color="textSecondary"
            className={classes.headers}
          >
            C++
          </Typography>
          <code>
            touch out.txt <br />
            clang++ -o main main.cpp <br />
            {`./main > out.txt`}
          </code>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="body1"
            color="textSecondary"
            className={classes.headers}
          >
            Python
          </Typography>
          <code>
            touch out.txt <br />
            {`python main.py > out.txt`}
          </code>
        </Grid>
      </Grid>
      <br />
      <Divider />
      <br />
      <div>
        <Typography
          variant="h5"
          color="textPrimary"
          className={classes.headers}
        >
          Professor Access
        </Typography>
        <p>
          Don't have access to professor permissions, but should? Contact us and
          we'll make things right!
        </p>
        <Button
          component="a"
          href="mailto:uassignapp@gmail.com"
          className={classes.supportButton}
        >
          Contact uassignapp@gmail.com
        </Button>
      </div>
    </>
  );
}
