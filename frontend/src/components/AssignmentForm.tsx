import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Assignment, {
  emptyAssignment,
  emptyTestCaseWithNewId,
  TestCase,
} from '../api/data/models/assignment.model';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import OptionalField from './OptionalField';
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  cardcontent: {
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(1),
    },
  },
  card: {
    marginBottom: theme.spacing(2),
  },
}));

interface CreateAssignmentFormProps {
  assignment: Assignment;
  setAssignment: Dispatch<SetStateAction<Assignment>> | any;
}

function TestCaseForm({ testCase, setTestCase, removeTestCase }: any) {
  const classes = useStyles();
  const handleFormChange = (event: any) => {
    const value = event.target.value;
    const name = event.target.name;

    setTestCase({
      ...testCase,
      [name]: value,
    });
  };
  return (
    <>
      <Card variant="outlined" className={classes.card}>
        <CardContent className={classes.cardcontent}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                variant="outlined"
                value={testCase?.input ?? ''}
                onChange={handleFormChange}
                name="input"
                label="Input"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                variant="outlined"
                value={testCase?.output ?? ''}
                onChange={handleFormChange}
                name="output"
                label="Expected output"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={testCase?.hidden}
                    onChange={() => {
                      setTestCase({ ...testCase, hidden: !testCase.hidden });
                    }}
                  />
                }
                label="Hidden"
              />
              <Button onClick={removeTestCase}>Remove</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
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

  const addCase = () => {
    setAssignment((prev: Assignment) => {
      const newArr = prev.testCases
        ? [...prev.testCases, emptyTestCaseWithNewId()]
        : [emptyTestCaseWithNewId()];
      return {
        ...prev,
        testCases: newArr,
      };
    });
  };

  const modifyTestCase = (index: number) => (value: TestCase) => {
    setAssignment((prev: Assignment) => {
      const newArr = [...prev.testCases];
      newArr[index] = value;
      return {
        ...prev,
        testCases: newArr,
      };
    });
  };

  const removeTestCase = (index: number) => () => {
    setAssignment((prev: Assignment) => {
      const newArr = [...prev.testCases];
      newArr.splice(index, 1);
      return {
        ...prev,
        testCases: newArr,
      };
    });
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
          <KeyboardDateTimePicker
            fullWidth
            margin="normal"
            inputVariant="outlined"
            label="Open Date"
            format="MMMM Do, YYYY - hh:mm a"
            value={assignment.openDate}
            onChange={handleDateChange('openDate')}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <KeyboardDateTimePicker
            fullWidth
            margin="normal"
            inputVariant="outlined"
            id="date-picker-dialog"
            label="Close Date"
            format="MMMM Do, YYYY - hh:mm a"
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
            component={KeyboardDateTimePicker}
            defaultValue={emptyAssignment.lateDate}
            fullWidth
            margin="normal"
            inputVariant="outlined"
            id="date-picker-dialog"
            label="Late Date"
            optionLabel="Allow lates"
            format="MMMM Do, YYYY - hh:mm a"
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
        <Grid item xs={12}>
          <Typography variant="h5">Test Cases</Typography>
        </Grid>
        <Grid item xs={12}>
          {assignment?.testCases?.map((tCase, index) => (
            <TestCaseForm
              testCase={tCase}
              key={tCase.id}
              setTestCase={modifyTestCase(index)}
              removeTestCase={removeTestCase(index)}
            />
          ))}
          <Button variant="outlined" onClick={addCase}>
            Add test case
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
