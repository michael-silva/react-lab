import { useState, useEffect } from 'react';
import axios from 'axios';

const useDataApi = (initialUrl, initialData) => {
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

  return [{ isLoading, isError, data }, setUrl];
};

export default useDataApi;
