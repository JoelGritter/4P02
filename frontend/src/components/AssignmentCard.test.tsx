import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { sampleAssignment } from '../api/data/models/assignment.model';
import AssignmentCard from './AssignmentCard';
import { BrowserRouter } from 'react-router-dom';

const TestWrapper = ({ children }: any) => (
  <BrowserRouter>
    <RecoilRoot>{children}</RecoilRoot>
  </BrowserRouter>
);

test('Assignment card', () => {
  render(
    <TestWrapper>
      <AssignmentCard assignment={sampleAssignment} />
    </TestWrapper>
  );

  expect(screen.getByText(sampleAssignment.name)).toBeTruthy();
});
