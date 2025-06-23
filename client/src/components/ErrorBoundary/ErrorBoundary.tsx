import React, { Component, ErrorInfo, ReactNode } from 'react';

import { ErrorPage } from '../ErrorPage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'Unknown error';
      const errorStack = this.state.errorInfo?.componentStack || '';

      return (
        <ErrorPage
          title="Application Error"
          message="An unexpected error occurred. Please refresh the page to try again."
          error={errorMessage}
          errorDescription={process.env.NODE_ENV === 'development' ? errorStack : undefined}
          showHomeButton={true}
        />
      );
    }

    return this.props.children;
  }
}
