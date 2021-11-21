/**
 * For some ref read this article https://www.newline.co/fullstack-react/articles/introduction-to-web-workers-with-react/
 * See the samples working https://build-jrrpxladjd.now.sh/
 */

/* eslint-disable react/prop-types */
import './Pooling.css';
import debounce from 'lodash/debounce';
import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useCallback } from 'react/cjs/react.development';
import workerFile from './worker';
import WebWorker from './workerSetup';

// TODO: understand the benefits of hook instead of setInterval function
const useInterval = (callback, delay) => {
  const savedCallback = useRef(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = async () => {
      try {
        await savedCallback.current();
      } catch (e) {
        // TODO: error threating
        console.log(e);
      }
    };
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }

    return undefined;
  }, [delay]);
};

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

// TODO: understand the benefits of hook instead of setTimeout function
const useTimeout = (callback, delay) => {
  const savedCallback = useRef(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = async () => {
      try {
        await savedCallback.current();
      } catch (e) {
        // TODO: error threating
        console.log(e);
      }
    };
    if (delay !== null) {
      const id = setTimeout(tick, delay);
      return () => clearInterval(id);
    }

    return undefined;
  }, [delay]);
};

const useSafeTimeout = () => {
  const mounted = useRef(true);
  const timer = useRef(null);
  const setTimeout = useCallback((callback, delay) => new Promise((resolve, reject) => {
    timer.current = window.setTimeout((args) => {
      if (!mounted?.current) return;
      try {
        const result = callback(args);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    }, delay);
  }), []);

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    // TODO: I really need this ref to find out if component is dismounted
    return () => {
      mounted.current = false;
      clearTimeout(timer);
    };
  }, []);

  return setTimeout;
};

const usePooling = (callback, interval) => {
  const [lastExecution, setLastExecution] = useState(null);

  useEffect(() => {
    // TODO: an local variabel is really the best way to find out if component is dismounted
    let isDismounted = false;
    const delay = lastExecution ? Date.now() - lastExecution : 0;
    const timer = setTimeout(async () => {
      if (isDismounted) return;
      setLastExecution(Date.now());
      try {
        await callback();
      } catch (e) {
        console.log(e);
      }
    }, interval - delay);
    return () => {
      isDismounted = true;
      clearTimeout(timer);
    };
  }, [lastExecution, interval, callback]);
};

// TODO: write unite test for pooling with async
// TODO: Can useTimeout be used here? I really need an promiseTimeout?
const INTERVAL = 2000;
const PoolingNumber = () => {
  const [number, setNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const firstLoading = loading && number === null;
  const setTimeout = useSafeTimeout();
  usePooling(async () => {
    setLoading(true);
    await setTimeout(() => {
      setNumber(Date.now());
      setLoading(false);
    }, Math.random() * INTERVAL);
  }, INTERVAL);

  return firstLoading ? <div>loading...</div> : <div>Current: {number}</div>;
};

let renderCount = 0;
const FilterList = ({ names }) => {
  const [query, setQuery] = useState('');
  let filteredNames = names;
  if (query !== '') {
    filteredNames = names.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
  }

  const debouncedChangeHandler = useMemo(
    () => debounce((event) => {
      setQuery(event.target.value);
    }, 300),
    [],
  );

  useEffect(() => () => {
    debouncedChangeHandler.cancel();
  }, []);

  // eslint-disable-next-line no-plusplus
  console.log('Render', ++renderCount);
  return (
    <div>
      <input
        onChange={debouncedChangeHandler}
        type="text"
        placeholder="Type a query..."
      />
      {filteredNames.map((name) => <div key={name}>{name}</div>)}
    </div>
  );
};

const AsyncFilterList = ({ }) => {
  const [names, setNames] = useState([]);
  const [query, setQuery] = useState('');

  const debouncedChangeHandler = useMemo(
    () => debounce((event) => {
      setQuery(event.target.value);
    }, 300),
    [],
  );

  useEffect(() => () => {
    debouncedChangeHandler.cancel();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      let filteredNames = LIST_NAMES;
      if (query !== '') {
        // eslint-disable-next-line max-len
        filteredNames = LIST_NAMES.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
      }
      setNames(filteredNames);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // eslint-disable-next-line no-plusplus
  console.log('Render', ++renderCount);
  return (
    <div>
      <input
        onChange={debouncedChangeHandler}
        type="text"
        placeholder="Type a query..."
      />
      {names.map((name) => <div key={name}>{name}</div>)}
    </div>
  );
};

const WebWorkerFilterList = ({ }) => {
  const worker = useRef(null);
  const [names, setNames] = useState([]);
  const [query, setQuery] = useState('');

  const debouncedChangeHandler = useMemo(
    () => debounce((event) => {
      setQuery(event.target.value);
    }, 300),
    [],
  );

  useEffect(() => () => {
    debouncedChangeHandler.cancel();
  }, []);

  const fetchWebWorker = () => {
    worker.current.postMessage({ names: LIST_NAMES, query });

    worker.current.addEventListener('message', (event) => {
      console.log(event);
    });
  };

  useEffect(() => {
    worker.current = new WebWorker(workerFile);
    return () => worker.current.terminate();
  }, []);

  useEffect(() => {
    worker.current.postMessage({ names: LIST_NAMES, query });

    worker.current.addEventListener('message', (event) => {
      setNames(event.data);
    });
  }, [query]);

  // eslint-disable-next-line no-plusplus
  console.log('Render', ++renderCount);
  return (
    <div>
      <input
        onChange={debouncedChangeHandler}
        type="text"
        placeholder="Type a query..."
      />
      {names.map((name) => <div key={name}>{name}</div>)}
    </div>
  );
};

const LIST_NAMES = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

const Pooling = () => (
  <div className="root" data-testid="Pooling">
    Pooling Component
    <PoolingNumber />
    <WebWorkerFilterList names={LIST_NAMES} />
  </div>
);

Pooling.propTypes = {};

Pooling.defaultProps = {};

export default Pooling;
