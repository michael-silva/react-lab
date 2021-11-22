import { useState } from 'react';
// import useDataApi from './useDataApi'
import useDataApi from './useDataApiReducer';

const FetchPage = () => {
  const [query, setQuery] = useState('react');
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    'http://hn.algolia.com/api/v1/search?query=react',
    { hits: [] },
  );

  const isEmpty = !isError && !isLoading && data.hits.length === 0;

  return (
    <>
      <form
        onSubmit={(e) => {
          doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);
          e.preventDefault();
        }}
      >
        <input type="text" value={query} onChange={(event) => setQuery(event.target.value)} />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {isEmpty ? (
            <div>Results not found ...</div>
          ) : (
            data.hits.map((item) => (
              <li key={item.objectID}>
                <a href={item.url}>{item.title}</a>
              </li>
            ))
          )}
        </ul>
      )}
    </>
  );
};

export default FetchPage;
