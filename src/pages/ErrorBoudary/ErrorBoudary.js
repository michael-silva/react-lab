/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ErrorBoudary.css';
import Code from '../../components/code';

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
  <div className="notification is-danger is-light">
    <h2 className="title is-5">Something went wrong.</h2>
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
    <button className="button is-danger mr-2" type="button" onClick={clickHandle}>{children}</button>
  );
};

const AsyncRenderErrorButton = ({ children, id, delay }) => {
  const [hasError, setHasError] = useState(false);
  const clickHandle = () => {
    setTimeout(() => {
      setHasError(true);
    }, delay || 1000);
  };

  if (hasError) {
    throw new Error(`Error for: ${id}`);
  }

  return (
    <button className="button is-danger mr-2" type="button" onClick={clickHandle}>{children}</button>
  );
};

const AsyncUncatchErrorButton = ({ children, id }) => {
  const clickHandle = () => {
    setTimeout(() => {
      throw new Error(`Error for: ${id}`);
    }, 2000);
  };

  return (
    <button className="button is-danger mr-2" type="button" onClick={clickHandle}>{children}</button>
  );
};

const UncatchErrorButton = ({ children, id }) => {
  const clickHandle = () => {
    throw new Error(`Error for: ${id}`);
  };

  return (
    <button className="button is-danger mr-2" type="button" onClick={clickHandle}>{children}</button>
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
    <button className="button is-danger mr-2" type="button" onClick={clickHandle}>{children}</button>
  );
};

const SecureUncatchAsyncErrorButton = ({ children, id }) => {
  const clickHandle = useSecureCallback(async () => {
    await promiseTimeout(() => {
      throw new Error(`Error for: ${id}`);
    }, 500);
  }, []);

  return (
    <button className="button is-danger mr-2" type="button" onClick={clickHandle}>{children}</button>
  );
};

const CustomFallback = () => <div className="notification is-warning">Componente fallback personalizado para erros dentro do ErrorBoundary</div>;
const ErrorBoudaryPage = () => {
  const [showError, setShowError] = useState(false);
  return (
    <div className="content">
      <h1 className="subtitle is-1">Error Boundary</h1>
      <hr />
      <p>
        Nesta página temos varios testes do uso de <strong>ErrorBoundary</strong> na prática,
        para mais detalhes pode conferir a <a href="https://reactjs.org/docs/error-boundaries.html">documentação oficial</a>.
      </p>
      <p>
        Para todos os exemplos nesta página vamos usar um ErrorBoundary implementado exatamente
        da forma como é descrita na documentação oficial, apenas testando seu funcionamento em
        situações adversas. <br />Dito isso para nossso primeiro experimento criamos um botão
        que ao ser clicado dispare um erro de renderização para que possamos conferir o
        comportamento do ErrorBoundary.
      </p>
      <p>
        <strong>OBS.</strong> rodando o projeto local uma mensagem de error cobrirá toda a tela,
        porém ela pode ser fechada para conferir o comportamento do ErrorBoundary em produção
      </p>
      <Code>{`const RenderErrorButton = ({ children, id }) => {
  const [hasError, setHasError] = useState(false);
  const clickHandle = () => {
    setHasError(true);
  };

  if (hasError) {
    throw new Error(\`Error for: \${id}\`);
  }

  return (
    <button className="button is-danger mr-2" type="button" onClick={clickHandle}>{children}</button>
  );
};
// Exemplo de uso
<ErrorBoundary fallback={CustomFallback}>
  <RenderErrorButton id="1">Click to error</RenderErrorButton>
  <RenderErrorButton id="2">Click to error</RenderErrorButton>
</ErrorBoundary>`}
      </Code>
      <div className="mb-4">
        <ErrorBoundary fallback={CustomFallback}>
          <RenderErrorButton id="1">Dispare um erro</RenderErrorButton>
          <RenderErrorButton id="2">Dispare outro erro</RenderErrorButton>
        </ErrorBoundary>
      </div>
      <p>
        Para nosso segundo experimento teremos dois botões cada um seu próprio ErrorBoundary,
        ao serem clicados eles também disparam erros de renderização, como no primeiro exemplo
        porém com um delay, esse erro ocorrerá apenas após um setTimeout.
      </p>
      <Code>{`const AsyncRenderErrorButton = ({ children, id }) => {
  const [hasError, setHasError] = useState(false);
  const clickHandle = () => {
    setTimeout(() => {
      setHasError(true);
    }, 1000);
  };

  if (hasError) {
    throw new Error(\`Error for: \${id}\`);
  }

  return (
    <button className="button is-danger mr-2" type="button" onClick={clickHandle}>{children}</button>
  );
};
// Exemplo de uso
<ErrorBoundary>
  <AsyncRenderErrorButton id="3">Click to async error</AsyncRenderErrorButton>
</ErrorBoundary>
<ErrorBoundary>
  <AsyncRenderErrorButton id="4">Click to async error</AsyncRenderErrorButton>
</ErrorBoundary>`}
      </Code>
      <div className="mb-4">
        <ErrorBoundary>
          <AsyncRenderErrorButton id="3">Dispare erro em 1s</AsyncRenderErrorButton>
        </ErrorBoundary>
        <ErrorBoundary>
          <AsyncRenderErrorButton id="4" delay={2000}>Dispare erro em 2s</AsyncRenderErrorButton>
        </ErrorBoundary>
      </div>

      <p>
        Para nosso terceiro experimento implementamos situações em que o ErrorBoundary
        não consegue pegar os erros, o primeiro é um botão que dispare um erro de
        evento diretamente no evento de clique e o outro é um erro disparado dentro de
        um setTimeout. <br />
        <strong>OBS.</strong> Apesar dos exemplos aqui implementados usando o evento de click,
        as mesmas regras se aplicam para eventos do lifecycle do React como dentro de um useEffect
        ou useLayoutEffect
      </p>
      <Code>{`const UncatchErrorButton = ({ children, id }) => {
  const clickHandle = () => {
    throw new Error(\`Error for: \${id}\`);
  };

  return (
    <button className="button is-danger mr-2" type="button" onClick={clickHandle}>{children}</button>
  );
};
// Exemplo de uso
<ErrorBoundary>
  <UncatchErrorButton id="5">Click to thoew an error</UncatchErrorButton>
</ErrorBoundary>`}
      </Code>
      <div className="mb-4">
        <ErrorBoundary>
          <UncatchErrorButton id="5">Clique para disparar um erro de evento</UncatchErrorButton>
        </ErrorBoundary>
      </div>
      <Code>{`const AsyncUncatchErrorButton = ({ children, id }) => {
  const clickHandle = () => {
    setTimeout(() => {
      throw new Error(\`Error for: \${id}\`);
    }, 2000);
  };

  return (
    <button className="button is-danger mr-2" type="button" onClick={clickHandle}>{children}</button>
  );
};
// Exemplo de uso
<ErrorBoundary>
  <UncatchErrorBox id="5">Click to thoew an error</UncatchErrorBox>
</ErrorBoundary>`}
      </Code>
      <div className="mb-4">
        <ErrorBoundary>
          <AsyncUncatchErrorButton id="6">Clique para disparar um erro em 1s</AsyncUncatchErrorButton>
        </ErrorBoundary>
      </div>
      <p>
        Com isso concluimos que para tratar erros de eventos é necessário o uso de try/catch.
        Isso nos leva a dois problemas, repetição nos blocos de código para tratamento de erro
        em multiplas funções e a descentralização do contole de erros, tendo os erros de
        renderização tratados no ErrorBoundary e os erros de eventos tratados manualmente.
      </p>
      <p>
        Para solucionar estes problemas alguns simples hooks podem evitar a repetição de código
        e converter os erros de evento em erros de renderização, assim centralizando o tratamento
        de erros apenas nos ErrorBoundary.
      </p>
      <Code>
        {`// Replace the react hook useCallback
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
    // Dispara um erro de renderizão para ser tratado pelo ErrorBoundary
    throw error;
  }

  return fn;
};

// Replace the react hook useEffect
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
    // Dispara um erro de renderizão para ser tratado pelo ErrorBoundary
    throw error;
  }
};
// Exemplos de erro tratado pelo ErrorBoundary
const SecureUncatchErrorButton = ({ children }) => {
  const clickHandle = useSecureCallback(() => {
    throw new Error('Unexpected Error');
  }, []);

  return (
    <button className="button is-danger mr-2" type="button" onClick={clickHandle}>{children}</button>
  );
};
// Exemplos de erro não tratado
const SecureUncatchErrorButton = ({ children }) => {
  const clickHandle = useCallback(() => {
    throw new Error('Unexpected Error');
  }, []);

  return (
    <button className="button is-danger mr-2" type="button" onClick={clickHandle}>{children}</button>
  );
};`}
      </Code>
      <ErrorBoundary>
        <SecureUncatchErrorButton id="7">Disparar erro de evento</SecureUncatchErrorButton>
        <SecureUncatchAsyncErrorButton id="8">Disparar erro depois de 1s</SecureUncatchAsyncErrorButton>
      </ErrorBoundary>
      <ErrorBoundary>
        <button type="button" className="button is-warning" onClick={() => setShowError(true)}>
          Disparar erro ao carregar um novo elemento
        </button>
        {showError && <SecureUncatchErrorBox text="Erro disparado dentro de um useSecureEffect" />}
      </ErrorBoundary>
    </div>
  );
};

ErrorBoudaryPage.propTypes = {};

ErrorBoudaryPage.defaultProps = {};

export default ErrorBoudaryPage;
