/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';

const FetchBox = ({
  children: Children,
  baseUrl,
  dataPath,
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
        const result = await axios.get(`${baseUrl}`, queryParams);
        setData(result.data[dataPath]);
      } catch (e) {
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [baseUrl, dataPath, queryParams]);

  return (
    <>
      {isError && <Error />}
      {isLoading && <Placeholder />}
      {!isLoading && !isError && (isEmpty ? <Empty /> : <Children data={data} />)}
    </>
  );
};

const FetchPage = () => {
  const [query, setQuery] = useState('react');
  const [queryParams, setQueryParams] = useState({ query });

  return (
    <>
      <form
        onSubmit={(e) => {
          setQueryParams({ ...queryParams, query });
          e.preventDefault();
        }}
      >
        <input type="text" value={query} onChange={(event) => setQuery(event.target.value)} />
        <button type="submit">Search</button>
      </form>
      <FetchBox
        dataPath="hits"
        baseUrl="http://hn.algolia.com/api/v1/search"
        queryParams={queryParams}
        Placeholder={() => <div>Loading ...</div>}
        Empty={() => <div>Results not found ...</div>}
        Error={() => <div>Something went wrong ...</div>}
      >
        {({ data = [] }) => (
          <ul>
            {data.map((item) => (
              <li key={item.objectID}>
                <a href={item.url}>{item.title}</a>
              </li>
            ))}
          </ul>
        )}
      </FetchBox>
    </>
  );
};

export default FetchPage;
