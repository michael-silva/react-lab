/* eslint-disable react/prop-types */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import './Random.css';

const ToggleContext = React.createContext();

function useToggleContext() {
  const context = React.useContext(ToggleContext);
  if (!context) {
    throw new Error(
      'Toggle compound components cannot be rendered outside the Toggle component',
    );
  }
  return context;
}

const Switch = ({ on = false, onClick, children }) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label>
    <input type="checkbox" checked={on} onClick={onClick} /> {children}
  </label>
);

const On = ({ children }) => {
  const { on } = useToggleContext();
  return on ? children : null;
};

const Off = ({ children }) => {
  const { on } = useToggleContext();
  return on ? null : children;
};

const Button = (props) => {
  const { on, toggle } = useToggleContext();
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Switch on={on} onClick={toggle} {...props} />;
};

const Toggle = ({ children, onToggle }) => {
  const [on, setOn] = useState(false);
  const toggle = useCallback(() => setOn((oldOn) => !oldOn), []);
  useEffect(() => {
    onToggle(on);
  }, [on]);
  const value = useMemo(() => ({ on, toggle }), [on]);
  return (
    <ToggleContext.Provider value={value}>
      {children}
    </ToggleContext.Provider>
  );
};

// for convenience, but totally not required...
Toggle.On = On;
Toggle.Off = Off;
Toggle.Button = Button;

const ToogleApp = () => (
  <Toggle onToggle={(on) => console.log(on)}>
    <Toggle.On>The button is on</Toggle.On>
    <Toggle.Off>The button is off</Toggle.Off>
    <Toggle.Button>checkbox</Toggle.Button>
  </Toggle>
);
const RandomPage = () => (

  <div className="root" data-testid="Random">
    Random component
    <ToogleApp />
  </div>
);

RandomPage.propTypes = {};

RandomPage.defaultProps = {};

export default RandomPage;
