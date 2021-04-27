import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import Assignment, {
  sampleAssignment,
} from '../api/data/models/assignment.model';
import AssignmentForm from './AssignmentForm';
import { BrowserRouter } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { formatDateTime } from '../util/dateUtils';

const TestWrapper = ({ children }: any) => (
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <BrowserRouter>
      <RecoilRoot>{children}</RecoilRoot>
    </BrowserRouter>
  </MuiPickersUtilsProvider>
);

test('Displays correct values', () => {
  const mockCallback = jest.fn((assignment: Assignment) => {
    expect(assignment).toEqual(sampleAssignment);
  });

  render(
    <TestWrapper>
      <AssignmentForm
        assignment={sampleAssignment}
        setAssignment={mockCallback}
      />
    </TestWrapper>
  );

  expect((screen.getByLabelText('Name') as HTMLInputElement).value).toEqual(
    sampleAssignment.name
  );

  expect(
    (screen.getByLabelText('Description') as HTMLInputElement).value
  ).toEqual(sampleAssignment.description);

  expect(
    (screen.getByLabelText('Open Date') as HTMLInputElement).value
  ).toEqual(formatDateTime(sampleAssignment.openDate));

  expect(
    (screen.getByLabelText('Close Date') as HTMLInputElement).value
  ).toEqual(formatDateTime(sampleAssignment.closeDate));

  expect(
    (screen.getByLabelText('Max Grade') as HTMLInputElement).value
  ).toEqual(sampleAssignment.maxGrade + '');

  expect((screen.getByLabelText('Weight') as HTMLInputElement).value).toEqual(
    sampleAssignment.weight + ''
  );
});

test('Change triggers function', () => {
  const mockCallback = jest.fn(() => {});

  render(
    <TestWrapper>
      <AssignmentForm
        assignment={sampleAssignment}
        setAssignment={mockCallback}
      />
    </TestWrapper>
  );

  const desc = screen.getByLabelText('Description') as HTMLInputElement;

  fireEvent.change(desc, { target: { value: 'Nice' } });

  expect(mockCallback.mock.calls.length).toBe(1);
});
