import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Assignment from '../api/data/models/assignment.model';
import { KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

interface CreateAssignmentFormProps {
  assignment: Assignment;
  setAssignment: Dispatch<SetStateAction<Assignment>> | any;
}

export const AssignmentForm: React.FC<CreateAssignmentFormProps> = ({
  assignment,
  setAssignment,
}) => {
  const classes = useStyles();

  const handleDateChange = (date: Date | any) => {
    setAssignment((prev: any) => ({
      ...prev,
      dueDate: date,
    }));
  };

  const handleFormChange = (event: any) => {
    const value = event.target.value;

    setAssignment((prev: any) => ({
      ...prev,
      name: value,
    }));
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            id="name"
            name="assignemnt"
            label="Assignment Name"
            value={assignment.name}
            onChange={handleFormChange}
          />
        </Grid>
        <Grid container justify="space-around" style={{ margin: 12 }}>
          <KeyboardDatePicker
            fullWidth
            margin="normal"
            inputVariant="outlined"
            id="date-picker-dialog"
            label="Due Date"
            format="MMMM Do, YYYY"
            value={assignment.dueDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};
