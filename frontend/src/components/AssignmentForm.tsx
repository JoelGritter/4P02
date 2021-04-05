import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Assignment, {
  emptyAssignment,
} from '../api/data/models/assignment.model';
import { KeyboardDatePicker } from '@material-ui/pickers';
import OptionalField from './OptionalField';

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

  const handleDateChange = (fieldName: string) => (date: any) => {
    setAssignment((prev: any) => ({
      ...prev,
      [fieldName]: date,
    }));
  };

  const handleFormChange = (event: any) => {
    const value = event.target.value;
    const name = event.target.name;

    setAssignment((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            name="name"
            label="Name"
            value={assignment.name}
            onChange={handleFormChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <KeyboardDatePicker
            fullWidth
            margin="normal"
            inputVariant="outlined"
            label="Open Date"
            format="MMMM Do, YYYY"
            value={assignment.openDate}
            onChange={handleDateChange('openDate')}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <KeyboardDatePicker
            fullWidth
            margin="normal"
            inputVariant="outlined"
            id="date-picker-dialog"
            label="Close Date"
            format="MMMM Do, YYYY"
            value={assignment.closeDate}
            onChange={handleDateChange('closeDate')}
            helperText="Assignment will not be available for submission after this date"
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <OptionalField
            component={KeyboardDatePicker}
            defaultValue={emptyAssignment.lateDate}
            fullWidth
            margin="normal"
            inputVariant="outlined"
            id="date-picker-dialog"
            label="Late Date"
            optionLabel="Allow lates"
            format="MMMM Do, YYYY"
            value={assignment.lateDate}
            helperText="Submissions after this date are considered late"
            setValue={handleDateChange('lateDate')}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          ></OptionalField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            variant="outlined"
            name="maxGrade"
            label="Max Grade"
            value={assignment.maxGrade}
            onChange={handleFormChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            variant="outlined"
            name="weight"
            label="Weight"
            helperText="Ratio, e.g. 0.12"
            value={assignment.weight}
            onChange={handleFormChange}
          />
        </Grid>
      </Grid>
    </div>
  );
};
