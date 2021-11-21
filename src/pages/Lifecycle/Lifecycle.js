/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react';
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
const Lifecycle = () => console.log('render page') ?? (
  <div className="root" data-testid="Lifecycle">
    Lifecycle Component
    <Component name="component 1" />
    <Component name="component 2" />
  </div>
);

Lifecycle.propTypes = {};

Lifecycle.defaultProps = {};

export default Lifecycle;
