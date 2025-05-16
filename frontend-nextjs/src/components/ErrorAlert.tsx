import React from 'react';

interface ErrorAlertProps {
  message: string | null;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="mb-6 p-4 text-sm text-red-400 bg-red-900 rounded-lg shadow-md" role="alert">
      <span className="font-medium">Error:</span> {message}
    </div>
  );
};

export default ErrorAlert; 