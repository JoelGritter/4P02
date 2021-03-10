import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  headerContainer: {
    display: "flex",
    margin: theme.spacing(1),
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {},
  button: {
    margin: theme.spacing(1),
  },
}));

export default function CreateCoursePage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <Typography variant="h4">CreateCourse</Typography>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
          >
            Cancel
          </Button>
        </div>
      </div>
      <Typography variant="h4">form section</Typography>
    </div>
  );
}
