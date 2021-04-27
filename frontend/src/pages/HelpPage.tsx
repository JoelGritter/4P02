import React from 'react';
import { createStyles, Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headers: {
      marginBottom: theme.spacing(1),
    },
    fieldsContainer: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(1),
    },
  })
);

export default function HelpPage() {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h4">Help Page</Typography>
      <Grid container spacing={2} className={classes.fieldsContainer}>
        <Grid item xs={12}>
          <Typography
            variant="body1"
            color="textPrimary"
            className={classes.headers}
          >
            Compile Instructions
          </Typography>
          <p>
            In order to compile your programs in the following languages you
            will require a file with your submission called compile_and_run.sh
            <br />
            We have provided examples for each language of the languages
            supported below.
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
