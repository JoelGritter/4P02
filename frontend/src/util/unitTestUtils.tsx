import React from 'react';
import { RecoilRoot } from 'recoil';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { BrowserRouter } from 'react-router-dom';

export const TestWrapper = ({ children }: any) => (
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <BrowserRouter>
      <RecoilRoot>{children}</RecoilRoot>
    </BrowserRouter>
  </MuiPickersUtilsProvider>
);
