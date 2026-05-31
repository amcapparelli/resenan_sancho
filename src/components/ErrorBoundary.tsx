import React from 'react';

interface IErrorBoundaryState {
  hasError: boolean;
}

interface IErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render(): any {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Lo sentimos, algo salió mal. Estamos trabajando para solucionarlo.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
