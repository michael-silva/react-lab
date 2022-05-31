/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import axios from 'axios';
import { useState, useEffect, Suspense } from 'react';
import Code from '../../components/code';
// import useDataApi from './useDataApi'
import useDataApi from './useDataApiReducer';
import withDataFetching from './withDataFetching';

const SearchPanelTemplate = ({
  title, children, value, onChange, onSubmit,
}) => (
  <article className="panel is-primary">
    <p className="panel-heading">
      {title}
    </p>
    <div className="panel-block">
      <form className="control has-icons-left" onSubmit={onSubmit}>
        <input className="input is-primary" type="text" placeholder="Search" value={value} onChange={onChange} />
        <span className="icon is-left">
          <i className="mdi mdi-magnify" aria-hidden="true" />
        </span>
      </form>
    </div>
    {children}
  </article>
);

const ArticlesPaneV1 = () => {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('react');
  const [url, setUrl] = useState('http://hn.algolia.com/api/v1/search?query=react');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const isEmpty = !isError && !isLoading && data.hits.length === 0;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const result = await axios(url);
        setData(result.data);
      } catch (e) {
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  const handleSubmit = (e) => {
    setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`);
    e.preventDefault();
  };

  return (
    <SearchPanelTemplate title="ArticlesPaneV1" onSubmit={handleSubmit} value={query} onChange={(event) => setQuery(event.target.value)}>
      {isLoading && (<progress className="progress is-small is-primary" max="100" />)}
      {!isLoading && isError && <div className="notification is-danger">Something got wrong, please try again after some seconds</div>}
      {!isError && !isLoading && (
      <>
        {isEmpty && (<div className="notification is-warning">Results not found, try another search term</div>)}
        {!isEmpty && (
          data.hits.slice(0, 5).map((item) => (
            <a key={item.objectID} href={item.url} target="_blank" className="panel-block" rel="noreferrer">
              {item.title}
            </a>
          ))
        )}
      </>
      )}
    </SearchPanelTemplate>
  );
};

const FetchBox = ({
  children: Children,
  baseUrl,
  queryParams,
  Placeholder,
  Empty,
  Error,
}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const isEmpty = !isError && !isLoading && data.length === 0;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const result = await axios.get(`${baseUrl}`, { params: queryParams });
        setData(result.data);
      } catch (e) {
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [baseUrl, queryParams]);

  return (
    <>
      {isError && <Error />}
      {isLoading && <Placeholder />}
      {!isLoading && !isError && (isEmpty ? <Empty /> : <Children data={data} />)}
    </>
  );
};

const ArticlesPaneV2 = () => {
  const [query, setQuery] = useState('react');
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    'http://hn.algolia.com/api/v1/search?query=react',
    { hits: [] },
  );

  const isEmpty = !isError && !isLoading && data.hits.length === 0;

  const handleSubmit = (e) => {
    doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);
    e.preventDefault();
  };

  return (
    <SearchPanelTemplate title="ArticlesPaneV2" onSubmit={handleSubmit} value={query} onChange={(event) => setQuery(event.target.value)}>
      {isLoading && (<progress className="progress is-small is-primary" max="100" />)}
      {!isLoading && isError && <div className="notification is-danger">Something got wrong, please try again after some seconds</div>}
      {!isError && !isLoading && (
      <>
        {isEmpty && (<div className="notification is-warning">Results not found, try another search term</div>)}
        {!isEmpty && (
          data.hits.slice(0, 5).map((item) => (
            <a key={item.objectID} href={item.url} target="_blank" className="panel-block" rel="noreferrer">
              {item.title}
            </a>
          ))
        )}
      </>
      )}
    </SearchPanelTemplate>
  );
};

const ArticlesV3 = ({
  data, isLoading, isError, doFetch,
}) => {
  const [query, setQuery] = useState('react');
  const isEmpty = !isError && !isLoading && data.hits.length === 0;

  const handleSubmit = (e) => {
    doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);
    e.preventDefault();
  };

  return (
    <SearchPanelTemplate title="ArticlesPaneV3" onSubmit={handleSubmit} value={query} onChange={(event) => setQuery(event.target.value)}>
      {isLoading && (<progress className="progress is-small is-primary" max="100" />)}
      {!isLoading && isError && <div className="notification is-danger">Something got wrong, please try again after some seconds</div>}
      {!isError && !isLoading && (
      <>
        {isEmpty && (<div className="notification is-warning">Results not found, try another search term</div>)}
        {!isEmpty && (
          data.hits.slice(0, 5).map((item) => (
            <a key={item.objectID} href={item.url} target="_blank" className="panel-block" rel="noreferrer">
              {item.title}
            </a>
          ))
        )}
      </>
      )}
    </SearchPanelTemplate>
  );
};

const ArticlesPaneV3 = withDataFetching(ArticlesV3, {
  url: 'http://hn.algolia.com/api/v1/search?query=react',
  data: { hits: [] },
});

const ArticlesPaneV4 = () => {
  const [query, setQuery] = useState('react');
  const [queryParams, setQueryParams] = useState({ query });

  const handleSubmit = (e) => {
    setQueryParams({ ...queryParams, query });
    e.preventDefault();
  };

  return (
    <SearchPanelTemplate title="ArticlesPaneV4" onSubmit={handleSubmit} value={query} onChange={(event) => setQuery(event.target.value)}>
      <FetchBox
        baseUrl="http://hn.algolia.com/api/v1/search"
        queryParams={queryParams}
        Placeholder={() => <progress className="progress is-small is-primary" max="100" />}
        Empty={() => <div className="notification is-warning">Results not found, try another search term</div>}
        Error={() => <div className="notification is-danger">Something got wrong, please try again after some seconds</div>}
      >
        {({ data = {} }) => (
          data.hits.slice(0, 5).map((item) => (item.title
            && (
            <a key={item.objectID} href={item.url} target="_blank" className="panel-block" rel="noreferrer">
              {item.title}
            </a>
            )
          ))
        )}
      </FetchBox>
    </SearchPanelTemplate>
  );
};

const wrapPromise = (promise) => {
  let status = 'pending';
  let response;

  const suspender = promise.then(
    (res) => {
      status = 'success';
      response = res;
    },
    (err) => {
      status = 'error';
      response = err;
    },
  );

  const read = () => {
    switch (status) {
      case 'pending':
        throw suspender;
      case 'error':
        throw response;
      default:
        return response;
    }
  };

  return { read };
};

const fetchData = (url) => {
  const promise = fetch(url)
    .then((res) => res.json())
    .then((res) => res.data);

  return wrapPromise(promise);
};

const resource = fetchData(
  'http://hn.algolia.com/api/v1/search?query=react',
);

const ArticlesPaneV5 = () => {
  const [query, setQuery] = useState('react');
  const data = resource.read();

  const isEmpty = data.hits.length === 0;

  const handleSubmit = (e) => {
    // doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);
    e.preventDefault();
  };

  return (
    <SearchPanelTemplate title="ArticlesPaneV5" onSubmit={handleSubmit} value={query} onChange={(event) => setQuery(event.target.value)}>
      <Suspense fallback={<progress className="progress is-small is-primary" max="100" />}>
        {isEmpty && (<div className="notification is-warning">Results not found, try another search term</div>)}
        {!isEmpty && (
          data.hits.slice(0, 5).map((item) => (
            <a key={item.objectID} href={item.url} target="_blank" className="panel-block" rel="noreferrer">
              {item.title}
            </a>
          ))
        )}
      </Suspense>
    </SearchPanelTemplate>
  );
};

const FetchPage = () => (
  <div className="content">
    <h1 className="subtitle is-1">Fetch data </h1>
    <hr />
    <p>
      O fetch de dados é uma terefa comum no dia a dia dos desenvolvedores e podemos
      fazer isso manualmente ou com alguma lib como o axios sem muita dificulade.
      Sendo assim  a proposta deste experimento é entender as melhores abordagens
      para a DX (Dev Experience), ou seja, facilidade de manutenção de menor
      quantidade de linhas duplicadas.
    </p>
    <p>
      O primeiro experimento é implementar a lógica do fetch completamente dentro do componente,
      sem reuso nenhum de lógica essa acaba sendo a abordagem com maior quantidade de códigos
      duplicados entre componentes.
    </p>
    <Code>
      {`const ArticlesPanel = () => {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('react');
  const [url, setUrl] = useState('http://hn.algolia.com/api/v1/search?query=react');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const isEmpty = !isError && !isLoading && data.hits.length === 0;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const result = await axios(url);
        setData(result.data);
      } catch (e) {
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  const handleSubmit = (e) => {
    setUrl(\`http://hn.algolia.com/api/v1/search?query=\${query}\`);
    e.preventDefault();
  };

  return (
    <SearchPanelTemplate title="ArticlesPaneV1" onSubmit={handleSubmit} value={query} onChange={(event) => setQuery(event.target.value)}>
      {isLoading && (<progress className="progress is-small is-primary" max="100" />)}
      {!isLoading && isError && <div className="notification is-danger">Something got wrong, please try again after some seconds</div>}
      {!isError && !isLoading && (
      <>
        {isEmpty && (<div className="notification is-warning">Results not found, try another search term</div>)}
        {!isEmpty && (
          data.hits.map((item) => (
            <a key={item.objectID} href={item.url} target="_blank" className="panel-block" rel="noreferrer">
              {item.title}
            </a>
          ))
        )}
      </>
      )}
    </SearchPanelTemplate>
  );
};
      `}
    </Code>
    <ArticlesPaneV1 />
    <p>
      O segundo experimento é implementar um hook para abstrair a lógica do fetch e possibilitar
      que ela seja reusada em outros componentes, essa abordadagem é bem flexivel e deixa o código
      limpo facilitando a manuteção e evitando a repetição de código.
    </p>
    <Code>
      {`const ArticlesPanel = () => {
  const [query, setQuery] = useState('react');
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    'http://hn.algolia.com/api/v1/search?query=react',
    { hits: [] },
  );

  const isEmpty = !isError && !isLoading && data.hits.length === 0;

  const handleSubmit = (e) => {
    doFetch(\`http://hn.algolia.com/api/v1/search?query=\${query}\`);
    e.preventDefault();
  };


  return (
    <SearchPanelTemplate title="ArticlesPaneV1" onSubmit={handleSubmit} value={query} onChange={(event) => setQuery(event.target.value)}>
      {isLoading && (<progress className="progress is-small is-primary" max="100" />)}
      {!isLoading && isError && <div className="notification is-danger">Something got wrong, please try again after some seconds</div>}
      {!isError && !isLoading && (
      <>
        {isEmpty && (<div className="notification is-warning">Results not found, try another search term</div>)}
        {!isEmpty && (
          data.hits.map((item) => (
            <a key={item.objectID} href={item.url} target="_blank" className="panel-block" rel="noreferrer">
              {item.title}
            </a>
          ))
        )}
      </>
      )}
    </SearchPanelTemplate>
  );
};
      `}
    </Code>
    <ArticlesPaneV2 />
    <p>
      O terceiro experimento é implementar uma HOC para abstrair a lógica do fetch e possibilitar
      que ela seja reusada em outros componentes, essa abordadagem não se mostrou muito flexivel
      mas deixa o código limpo e tambem evita a repetição de código.
    </p>
    <Code>
      {`const ArticlesV3 = ({
  data, isLoading, isError, doFetch,
}) => {
  const [query, setQuery] = useState('react');
  const isEmpty = !isError && !isLoading && data.hits.length === 0;

  const handleSubmit = (e) => {
    doFetch(\`http://hn.algolia.com/api/v1/search?query=\${query}\`);
    e.preventDefault();
  };

  return (
    <SearchPanelTemplate title="ArticlesPaneV3" onSubmit={handleSubmit} value={query} onChange={(event) => setQuery(event.target.value)}>
      {isLoading && (<progress className="progress is-small is-primary" max="100" />)}
      {!isLoading && isError && <div className="notification is-danger">Something got wrong, please try again after some seconds</div>}
      {!isError && !isLoading && (
      <>
        {isEmpty && (<div className="notification is-warning">Results not found, try another search term</div>)}
        {!isEmpty && (
          data.hits.map((item) => (
            <a key={item.objectID} href={item.url} target="_blank" className="panel-block" rel="noreferrer">
              {item.title}
            </a>
          ))
        )}
      </>
      )}
    </SearchPanelTemplate>
  );
};

const ArticlesPaneV3 = withDataFetching(ArticlesV3, {
  url: 'http://hn.algolia.com/api/v1/search?query=react',
  data: { hits: [] },
});
      `}
    </Code>
    <ArticlesPaneV3 />
    <p>
      O quarto experimento é implementar um componente para deixar de forma declarativa no JSX
      a lógica de fetch, essa abordagem se mostrou bem interessante porém funciona melhor para
      o GET de dados, não parece muito interessante para os outros metodos (POST, PU, DELETE)
    </p>
    <Code>
      {`const ArticlesPanel = () => {
  const [query, setQuery] = useState('react');
  const [queryParams, setQueryParams] = useState({ query });

  const handleSubmit = (e) => {
    setQueryParams({ ...queryParams, query });
    e.preventDefault();
  };

  return (
    <SearchPanelTemplate title="ArticlesPaneV4" onSubmit={handleSubmit} value={query} onChange={(event) => setQuery(event.target.value)}>
      <FetchBox
        baseUrl="http://hn.algolia.com/api/v1/search"
        queryParams={queryParams}
        Placeholder={() => <progress className="progress is-small is-primary" max="100" />}
        Empty={() => <div className="notification is-warning">Results not found, try another search term</div>}
        Error={() => <div className="notification is-danger">Something got wrong, please try again after some seconds</div>}
      >
        {({ data = {} }) => (
          data.hits.map((item) => (item.title
            && (
            <a key={item.objectID} href={item.url} target="_blank" className="panel-block" rel="noreferrer">
              {item.title}
            </a>
            )
          ))
        )}
      </FetchBox>
    </SearchPanelTemplate>
  );
};
      `}
    </Code>
    <ArticlesPaneV4 />
    <p>
      O quinto e ultimo experimento só esta disponivel na recem lançada versão 18 do React
      usando o Suspense para o fetch de dados.
    </p>
    {/* <ArticlesPaneV5 /> */}
  </div>
);

export default FetchPage;
