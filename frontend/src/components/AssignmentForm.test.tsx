import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Assignment, {
  sampleAssignment,
} from '../api/data/models/assignment.model';
import AssignmentForm from './AssignmentForm';
import { formatDateTime } from '../util/dateUtils';
import { TestWrapper } from '../util/unitTestUtils';

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

test('Cases Display', () => {
  const mockCallback = jest.fn(() => {});

  render(
    <TestWrapper>
      <AssignmentForm
        assignment={sampleAssignment}
        setAssignment={mockCallback}
      />
    </TestWrapper>
  );

  const inputs = screen.getAllByLabelText('Input') as HTMLInputElement[];
  const outputs = screen.getAllByLabelText(
    'Expected output'
  ) as HTMLInputElement[];
  const hiddenCheckboxes = screen.getAllByLabelText(
    'Hidden'
  ) as HTMLInputElement[];

  for (let i = 0; i < sampleAssignment.testCases.length; i++) {
    expect(inputs[i].value).toBe(sampleAssignment.testCases[i].input);
    expect(outputs[i].value).toBe(sampleAssignment.testCases[i].output);
    expect(hiddenCheckboxes[i].checked).toBe(
      sampleAssignment.testCases[i].hidden
    );
  }
});
