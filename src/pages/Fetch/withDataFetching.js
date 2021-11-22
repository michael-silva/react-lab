import { useState, useEffect } from 'react';
import axios from 'axios';

const withDataFetching = (WrappedComponent, { url: initialUrl, data: initialData }) => {
  const WithDataFetching = (...args) => {
    const [data, setData] = useState(initialData);
    const [url, setUrl] = useState(initialUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
      let didCancel = false;
      const fetchData = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
          const result = await axios(url);

          if (!didCancel) {
            setData(result.data);
            setIsLoading(false);
          }
        } catch (e) {
          if (!didCancel) {
            setIsError(true);
            setIsLoading(false);
          }
        }
      };

      fetchData();

      return () => {
        didCancel = true;
      };
    }, [url]);

    return (
      <WrappedComponent
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...args}
        isLoading={isLoading}
        isError={isError}
        data={data}
        doFetch={setUrl}
      />
    );
  };

  WithDataFetching.displayName = `WithDataFetching(${WrappedComponent.name})`;

  return WithDataFetching;
};

export default withDataFetching;
