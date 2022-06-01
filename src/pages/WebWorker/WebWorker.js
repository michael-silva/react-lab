import './WebWorker.css';
import {
  useEffect, useRef, useState,
} from 'react';
import workerFile from './worker';
import WebWorker from './workerSetup';

const LocalCounter = () => {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);

  const fetchUsers = () => {
    const users = [];
    const start = Date.now();

    const userDetails = {
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      id: 1,
    };

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 10000000; i++) {
      // eslint-disable-next-line no-plusplus
      userDetails.id = i++;
      userDetails.dateJoined = Date.now();

      users.push(userDetails);
    }

    setCount(users.length);
    setTime(Date.now() - start);
  };

  return (
    <section className="App-right">
      <p className="text-center">Total User Count: {count}</p>
      <p className="text-center">Total Time Spent: {time}</p>
      <button type="button" className="btn-worker" onClick={fetchUsers}>Fetch Users directly</button>
    </section>
  );
};

const WebWorkerCounter = () => {
  const worker = useRef(null);
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);

  const fetchWebWorker = () => {
    const start = Date.now();
    worker.current.postMessage('Fetch Users');

    worker.current.addEventListener('message', (event) => {
      setCount(event.data.length);
      setTime(Date.now() - start);
    });
  };

  useEffect(() => {
    worker.current = new WebWorker(workerFile);
  }, []);

  return (
    <section className="App-right">
      <p className="text-center">Total User Count: {count}</p>
      <p className="text-center">Total Time Spent: {time}</p>
      <button type="button" className="btn-worker" onClick={fetchWebWorker}>Fetch Users with Web Worker</button>
    </section>
  );
};

const WebWorkerPage = () => (
  <div className="root" data-testid="WebWorker">
    <h1 className="subtitle is-1">[WIP] WebWorker</h1>
    <hr />
    <LocalCounter />
    <WebWorkerCounter />
  </div>
);

WebWorkerPage.propTypes = {};

WebWorkerPage.defaultProps = {};

export default WebWorkerPage;
