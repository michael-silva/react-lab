/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ErrorBoudary.css';

const promiseTimeout = (callback, timeout) => new Promise((resolve, reject) => {
  setTimeout((args) => {
    try {
      const result = callback(args);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }, timeout);
});

const useSecureCallback = (callback, deps) => {
  const [error, setError] = useState(null);
  const fn = useCallback(async (args) => {
    try {
      await callback(args);
    } catch (e) {
      setError(e);
    }
  }, deps);

  if (error) {
    throw error;
  }

  return fn;
};

const useSecureEffect = (callback, deps) => {
  const [error, setError] = useState(null);
  useEffect((args) => {
    try {
      return callback(args);
    } catch (e) {
      setError(e);
      return undefined;
    }
  }, deps);

  if (error) {
    throw error;
  }
};

const ErrorFallback = React.memo(({ error, errorInfo }) => (
  <div>
    <h2>Something went wrong.</h2>
    <details style={{ whiteSpace: 'pre-wrap' }}>
      {error && error.toString()}
      <br />
      {errorInfo.componentStack}
    </details>
  </div>
));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      const FallbackElement = this.props.fallback;
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <FallbackElement {...this.state} />;
    }
    // Normally, just render children
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  fallback: PropTypes.element,
};

ErrorBoundary.defaultProps = {
  fallback: ErrorFallback,
};

const withErrorBoundary = (WrappedComponent, { fallback } = {}) => ({ ...props }) => (
  <ErrorBoundary fallback={fallback}>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <WrappedComponent {...props} />
  </ErrorBoundary>
);

const RenderErrorButton = ({ children, id }) => {
  const [hasError, setHasError] = useState(false);
  const clickHandle = () => {
    setHasError(true);
  };

  if (hasError) {
    throw new Error(`Error for: ${id}`);
  }

  return (
    <button type="button" onClick={clickHandle}>{children}</button>
  );
};

const AsyncRenderErrorButton = ({ children, id }) => {
  const [hasError, setHasError] = useState(false);
  const clickHandle = () => {
    setTimeout(() => {
      setHasError(true);
    }, 500);
  };

  if (hasError) {
    throw new Error(`Error for: ${id}`);
  }

  return (
    <button type="button" onClick={clickHandle}>{children}</button>
  );
};

const UncatchErrorBox = ({ children, text }) => {
  useEffect(() => {
    setTimeout(() => {
      throw new Error(`Error for: ${text}`);
    }, 2000);
  }, []);

  return (
    <div>{text}</div>
  );
};

const UncatchErrorButton = ({ children, id }) => {
  const clickHandle = () => {
    throw new Error(`Error for: ${id}`);
  };

  return (
    <button type="button" onClick={clickHandle}>{children}</button>
  );
};

const SecureUncatchErrorBox = ({ children, text }) => {
  useSecureEffect(() => {
    throw new Error(`Error for: ${text}`);
  }, []);

  return (
    <div>{text}</div>
  );
};

const SecureUncatchErrorButton = ({ children, id }) => {
  const clickHandle = useSecureCallback(() => {
    throw new Error(`Error for: ${id}`);
  }, []);

  return (
    <button type="button" onClick={clickHandle}>{children}</button>
  );
};

const SecureUncatchAsyncErrorButton = ({ children, id }) => {
  const clickHandle = useSecureCallback(async () => {
    await promiseTimeout(() => {
      throw new Error(`Error for: ${id}`);
    }, 500);
  }, []);

  return (
    <button type="button" onClick={clickHandle}>{children}</button>
  );
};

const AsyncRenderError = withErrorBoundary(({ children, id }) => {
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setHasError(true);
    }, 500);
  }, []);

  if (hasError) {
    throw new Error(`Error for: ${id}`);
  }

  return (
    <div>{children}</div>
  );
});

const CustomFallback = () => <h2>Custom error</h2>;
const ErrorBoudaryPage = () => (
  <>
    <div className="root" data-testid="ErrorBoudary">
      ErrorBoudary Component
    </div>
    <ErrorBoundary fallback={CustomFallback}>
      <RenderErrorButton id="1">Click to error</RenderErrorButton>
      <RenderErrorButton id="2">Click to error</RenderErrorButton>
    </ErrorBoundary>
    <ErrorBoundary>
      <AsyncRenderErrorButton id="3">Click to async error</AsyncRenderErrorButton>
    </ErrorBoundary>
    <ErrorBoundary>
      <AsyncRenderErrorButton id="4">Click to async error</AsyncRenderErrorButton>
    </ErrorBoundary>
    <ErrorBoundary>
      <UncatchErrorButton id="5">Click to uncatch error triggered in event</UncatchErrorButton>
    </ErrorBoundary>
    <ErrorBoundary>
      <UncatchErrorBox text="Error uncatch in 1000ms" />
    </ErrorBoundary>
    <AsyncRenderError id="7">
      An error wil be catch and treated here in 2000ms
    </AsyncRenderError>
    <ErrorBoundary>
      <SecureUncatchErrorButton id="6">Click to secure an uncacth error triggered in event</SecureUncatchErrorButton>
    </ErrorBoundary>
    <ErrorBoundary>
      <SecureUncatchErrorBox text="secure Error uncatchon load" />
    </ErrorBoundary>
    <ErrorBoundary>
      <SecureUncatchAsyncErrorButton id="8">Click to secure an uncacth error triggered in 500ms</SecureUncatchAsyncErrorButton>
    </ErrorBoundary>
  </>
);

ErrorBoudaryPage.propTypes = {};

ErrorBoudaryPage.defaultProps = {};

export default ErrorBoudaryPage;
