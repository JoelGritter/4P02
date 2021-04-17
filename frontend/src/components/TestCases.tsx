import { CircularProgress, Tab, Tabs, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import Assignment from '../api/data/models/assignment.model';
import Submission from '../api/data/models/submission.model';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { testsApiPost } from '../api/util';

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
  return (
    <>
      <span>
        {loading && <CircularProgress />}
        {!loading && correct && <CheckIcon />}
        {!loading && !correct && <CloseIcon />}
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
            const { success } = await testsApiPost('getTestResult', {
              testCaseId: tCase._id,
              assignmentId: assignment._id,
            });
            if (success) {
              mutateSub && mutateSub();
            }
          }
        }
      }
    })();
    // eslint-disable-next-line
  }, [JSON.stringify(assignment), JSON.stringify(submission.submissionDate)]);

  return (
    <>
      <Typography>Test Cases</Typography>
      {assignment && submission && (
        <>
          <Tabs value={value} onChange={handleChange}>
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
                  <pre>{currResCase.input}</pre>
                  <Typography variant="body1">Expected Output</Typography>
                  <pre>{currResCase.expectedOutput}</pre>
                  <Typography variant="body1">Your Output</Typography>
                  <pre>{currResCase.actualOutput}</pre>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default TestCases;
