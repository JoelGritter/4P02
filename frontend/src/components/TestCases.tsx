import {
  Box,
  CircularProgress,
  makeStyles,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Assignment from '../api/data/models/assignment.model';
import Submission from '../api/data/models/submission.model';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { testsApiPost } from '../api/util';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  preCls: {
    background: '#eeeeee',
    padding: theme.spacing(2),
  },
  tabs: {
    marginBottom: theme.spacing(2),
  },
  checkMark: {
    color: '#2EB100',
  },
  wrongMark: {
    color: '#ff0000',
  },
}));

interface TestCasesProps {
  assignment: Assignment;
  submission: Submission;
  mutateSub?: any;
}

function TestCaseIndicator({
  loading,
  correct,
}: {
  loading: boolean;
  correct: boolean;
}) {
  const classes = useStyles();
  const [curLoading, setLoading] = useState(loading);

  setTimeout(() => {
    setLoading(false);
  }, 10000);
  return (
    <>
      <span>
        {curLoading && <CircularProgress />}
        {!curLoading && correct && <CheckIcon className={classes.checkMark} />}
        {!curLoading && !correct && <CloseIcon className={classes.wrongMark} />}
      </span>
    </>
  );
}

const TestCases: React.FC<TestCasesProps> = ({
  assignment,
  submission,
  mutateSub,
}) => {
  const [value, setValue] = React.useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const currCase =
    assignment?.testCases.length > 0 && assignment.testCases[value];

  const currResCase =
    currCase && currCase._id && submission?.testCaseResults[currCase._id];

  useEffect(() => {
    (async () => {
      if (submission && assignment) {
        for (const tCase of assignment.testCases) {
          const resCase = tCase._id && submission.testCaseResults[tCase._id];

          if (!resCase && tCase._id) {
            const { success, message } = await testsApiPost('getTestResult', {
              testCaseId: tCase._id,
              assignmentId: assignment._id,
            });
            if (success) {
              mutateSub && mutateSub();
            } else {
              enqueueSnackbar(message ?? 'Unknown error running test');
            }
          }
        }
      }
    })();
    // eslint-disable-next-line
  }, [JSON.stringify(assignment), JSON.stringify(submission.submissionDate)]);

  const classes = useStyles();

  return (
    <>
      <Box marginTop={2}>
        <Typography variant="h6" gutterBottom>
          Test Cases
        </Typography>
        {assignment && submission && (
          <>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="secondary"
              className={classes.tabs}
            >
              {assignment.testCases.map((tCase) => {
                const caseRes = tCase._id
                  ? submission.testCaseResults[tCase._id]
                  : null;
                return (
                  <Tab
                    key={tCase._id}
                    label={
                      <TestCaseIndicator
                        loading={!caseRes}
                        correct={!!caseRes?.correct}
                        key={tCase._id}
                      />
                    }
                  />
                );
              })}
            </Tabs>
            {currResCase && (
              <>
                {currResCase.hidden && (
                  <Typography variant="body1">Hidden Case</Typography>
                )}

                {!currResCase.hidden && (
                  <>
                    <Typography variant="body1">Input</Typography>
                    <pre className={classes.preCls}>{currResCase.input}</pre>
                    <Typography variant="body1">Expected Output</Typography>
                    <pre className={classes.preCls}>
                      {currResCase.expectedOutput}
                    </pre>
                    <Typography variant="body1">Your Output</Typography>
                    <pre className={classes.preCls}>
                      {currResCase.actualOutput}
                    </pre>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default TestCases;
