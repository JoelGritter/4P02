import { CircularProgress, Typography } from '@material-ui/core';
import React from 'react';

interface RequestStatusProps {
  loading: boolean;
  failed: boolean;
  failedMessage: string;
}

const RequestStatus: React.FC<RequestStatusProps> = ({
  loading,
  failed,
  failedMessage,
}) => {
  return (
    <div>
      {loading && <CircularProgress />}
      {failed && (
        <Typography variant="body1" color="error">
          {failedMessage}
        </Typography>
      )}
    </div>
  );
};

export default RequestStatus;
