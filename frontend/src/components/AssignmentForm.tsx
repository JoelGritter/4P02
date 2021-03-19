import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Assignment from '../api/data/models/assignment.model';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

interface CreateAssignmentFormProps {
  assignment: Assignment;
  setAssignment: Dispatch<SetStateAction<Assignment>>;
}

export const AssignmentForm: React.FC<CreateAssignmentFormProps> = ({
  assignment,
  setAssignment,
}) => {
  const classes = useStyles();

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date('2021-03-18T21:11:54')
  );

  const handleDateChange = (date: Date | any) => {
    setSelectedDate(date);
  };

  const handleFormChange = (event: any) => {
    const value = event.target.value;

    setAssignment((prev: any) => ({
      ...prev,
      name: value,
      dueDate: selectedDate,
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
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid container justify="space-around" style={{ margin: 15 }}>
            <KeyboardDatePicker
              fullWidth
              margin="normal"
              id="date-picker-dialog"
              label="Due Date"
              format="MMMM Do, YYYY"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
    </div>
  );
};
