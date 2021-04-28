import React from 'react';
import { createStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
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
            variant="body1"
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
    </>
  );
}
