import { useState, useEffect } from 'react';
import axios from 'axios';

const FetchPage = () => {
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

  return (
    <>
      <form
        onSubmit={(e) => {
          setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`);
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
