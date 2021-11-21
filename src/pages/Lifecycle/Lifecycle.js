/* eslint-disable react/prop-types */
import React, {
  useCallback, useContext, useMemo, useState,
} from 'react';
import { useEffect } from 'react/cjs/react.development';
import './Lifecycle.css';

const Child = ({ text, onClick = () => null }) => {
  const [counter, setCounter] = useState(0);
  const handleClick = () => {
    setCounter((c) => c + 1);
    onClick();
  };
  console.log(`render child ${text}`);
  return (
    <button type="button" onClick={handleClick}>{text} {counter}</button>
  );
};

const ChildMemo = React.memo(({ text, onClick = () => null }) => {
  const [counter, setCounter] = useState(0);
  const handleClick = () => {
    setCounter((c) => c + 1);
    onClick();
  };
  console.log(`render child ${text}`);
  return (
    <button type="button" onClick={handleClick}>{text} {counter}</button>
  );
});

const Component = ({ name }) => {
  const [counter, setCounter] = useState(0);
  const [time, setTime] = useState('');
  const handleIncrease = useCallback(() => {
    setCounter((c) => c + 1);
    setCounter((c) => c + 1);
    setCounter((c) => c + 1);
    setTime(new Date().toLocaleString());
  }, []);
  const handleDecrease = () => {
    setCounter((c) => c - 1);
    setCounter((c) => c - 1);
    setCounter((c) => c - 1);
    setTime(new Date().toLocaleString());
  };
  console.log(`render ${name}`);
  return (
    <div>
      <p>{name}: {counter} (updated at {time})</p>
      <div>
        <button type="button" onClick={handleIncrease}>+</button>
        <button type="button" onClick={handleDecrease}>-</button>
      </div>
      <div>
        <Child text={`child-${name}`} />
        <ChildMemo text={`memo-${name}`} />
      </div>
      <div>
        <Child text={`child-${name}-inc`} onClick={handleIncrease} />
        <ChildMemo text={`memo-${name}-inc`} onClick={handleIncrease} />
      </div>
      <div>
        <Child text={`child-${name}-dec`} onClick={handleDecrease} />
        <ChildMemo text={`memo-${name}-dec`} onClick={handleDecrease} />
      </div>
    </div>
  );
};

const LifecycleApp1 = () => console.log('render app') ?? (
  <div className="root" data-testid="Lifecycle">
    Lifecycle Component
    <Component name="component 1" />
    <Component name="component 2" />
  </div>
);

const GlobalContext = React.createContext();

const Child2 = ({ text, onClick = () => null }) => {
  const [counter, setCounter] = useState(0);
  const handleClick = () => {
    setCounter((c) => c + 1);
    onClick();
  };
  console.log(`render child ${text}`);
  return (
    <button type="button" onClick={handleClick}>{text} {counter}</button>
  );
};

const ChildMemo2 = React.memo(({ text, onClick = () => null }) => {
  const [counter, setCounter] = useState(0);
  const handleClick = () => {
    setCounter((c) => c + 1);
    onClick();
  };
  console.log(`render child ${text}`);
  return (
    <button type="button" onClick={handleClick}>{text} {counter}</button>
  );
});

const Component2 = ({ name }) => {
  const {
    counters, addCounter, incCounter, decCounter,
  } = useContext(GlobalContext);
  const { time, value: counter } = counters[name] || {};

  const handleIncrease = useCallback(() => {
    incCounter(name);
  }, [incCounter, name]);

  const handleDecrease = useCallback(() => {
    decCounter(name);
  }, [decCounter, name]);

  useEffect(() => {
    addCounter(name);
  }, [addCounter, name]);

  // PREVENT from unnecessary reloads
  return (
    <div>
      <p>{name}: {counter} (updated at {time})</p>
      <div>
        <button type="button" onClick={handleIncrease}>+</button>
        <button type="button" onClick={handleDecrease}>-</button>
      </div>
      <div>
        <Child2 text={`child-${name}`} />
        <ChildMemo2 text={`memo-${name}`} />
      </div>
      <div>
        <Child2 text={`child-${name}-inc`} onClick={handleIncrease} />
        <ChildMemo2 text={`memo-${name}-inc`} onClick={handleIncrease} />
      </div>
      <div>
        <Child2 text={`child-${name}-dec`} onClick={handleDecrease} />
        <ChildMemo2 text={`memo-${name}-dec`} onClick={handleDecrease} />
      </div>
    </div>
  );
};

const Component2Optmized = ({ name }) => {
  const {
    counters, addCounter, incCounter, decCounter,
  } = useContext(GlobalContext);
  const { time, value: counter } = counters[name] || {};

  const handleIncrease = useCallback(() => {
    incCounter(name);
  }, [incCounter, name]);

  const handleDecrease = useCallback(() => {
    decCounter(name);
  }, [decCounter, name]);

  useEffect(() => {
    addCounter(name);
  }, [addCounter, name]);

  // PREVENT from unnecessary reloads
  return useMemo(() => console.log(`render ${name}`) ?? (
    <div>
      <p>{name}: {counter} (updated at {time})</p>
      <div>
        <button type="button" onClick={handleIncrease}>+</button>
        <button type="button" onClick={handleDecrease}>-</button>
      </div>
      <div>
        <Child2 text={`child-${name}`} />
        <ChildMemo2 text={`memo-${name}`} />
      </div>
      <div>
        <Child2 text={`child-${name}-inc`} onClick={handleIncrease} />
        <ChildMemo2 text={`memo-${name}-inc`} onClick={handleIncrease} />
      </div>
      <div>
        <Child2 text={`child-${name}-dec`} onClick={handleDecrease} />
        <ChildMemo2 text={`memo-${name}-dec`} onClick={handleDecrease} />
      </div>
    </div>
  ), [name, counter]);
};

const Component2Memo = ({ name }) => {
  const {
    counters, addCounter, incCounter, decCounter,
  } = useContext(GlobalContext);
  const { time, value: counter } = counters[name] || {};

  const handleIncrease = useCallback(() => {
    incCounter(name);
  }, [incCounter, name]);

  const handleDecrease = useCallback(() => {
    decCounter(name);
  }, [decCounter, name]);

  useEffect(() => {
    addCounter(name);
  }, [addCounter, name]);

  // PREVENT from unnecessary reloads
  return (
    <Component2MemoView
      counter={counter}
      name={name}
      time={time}
      handleDecrease={handleDecrease}
      handleIncrease={handleIncrease}
    />
  );
};

const Component2MemoView = React.memo(({
  name, counter, time, handleIncrease, handleDecrease,
}) => (
  <div>
    <p>{name}: {counter} (updated at {time})</p>
    <div>
      <button type="button" onClick={handleIncrease}>+</button>
      <button type="button" onClick={handleDecrease}>-</button>
    </div>
    <div>
      <Child2 text={`child-${name}`} />
      <ChildMemo2 text={`memo-${name}`} />
    </div>
    <div>
      <Child2 text={`child-${name}-inc`} onClick={handleIncrease} />
      <ChildMemo2 text={`memo-${name}-inc`} onClick={handleIncrease} />
    </div>
    <div>
      <Child2 text={`child-${name}-dec`} onClick={handleDecrease} />
      <ChildMemo2 text={`memo-${name}-dec`} onClick={handleDecrease} />
    </div>
  </div>
));

const LifecycleApp2 = () => {
  const [counters, setCounters] = useState([]);
  const addCounter = useCallback((name, value = 0) => {
    setCounters((counts) => ({
      ...counts,
      [name]: { value, time: '' },
    }));
  }, []);
  const updateCounter = useCallback((name, callback) => {
    setCounters((counts) => ({
      ...counts,
      [name]: callback(counts[name]),
    }));
  }, []);
  const incCounter = useCallback((name) => {
    updateCounter(name, (c) => ({ value: c.value + 1, time: new Date().toLocaleString() }));
  }, [updateCounter]);

  const decCounter = useCallback((name) => {
    updateCounter(name, (c) => ({ value: c.value - 1, time: new Date().toLocaleString() }));
  }, [updateCounter]);

  const value = useMemo(() => ({
    incCounter, decCounter, addCounter, counters,
  }), [incCounter, decCounter, addCounter, counters]);
  return (
    <div className="root" data-testid="Lifecycle">
      Lifecycle Component
      <GlobalContext.Provider value={value}>
        <Component2 name="component 1" />
        <Component2 name="component 2" />
        <Component2Optmized name="component 3" />
        <Component2Memo name="component 4" />
      </GlobalContext.Provider>
    </div>
  );
};

const LifecyclePage = () => console.log('render page') ?? (
  <div className="root" data-testid="Lifecycle">

    <LifecycleApp2 />
  </div>
);

LifecyclePage.propTypes = {};

LifecyclePage.defaultProps = {};

export default LifecyclePage;
