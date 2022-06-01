/* eslint-disable max-len */
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
    <input type="checkbox" checked={on} onChange={onClick} /> {children}
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

const Slide = ({ children, title }) => (
  title ? (
    <div id={`slide-${title}`}>
      {children}
    </div>
  ) : null
);

const Slider = ({ navigator = (props) => <a key={props.title} href={`#slide-${props.title}`}>{props.title}</a>, children }) => (
  <div className="slider">
    {React.Children.map(children, ({ props }) => (props.title ? navigator(props) : null))}

    <div className="slides">
      {children}
    </div>
  </div>
);

Slider.Slide = Slide;

const SliderApp = () => {
  const renderNavigator = useCallback(({ title }) => <><a key={title} href={`#slide-${title}`}>{title}</a> /</>, []);
  return (
    <Slider navigator={renderNavigator}>
      <Slider.Slide title="1">A</Slider.Slide>
      <Slider.Slide title="2">B</Slider.Slide>
      <Slider.Slide>C</Slider.Slide>
      <Slider.Slide title="4">D</Slider.Slide>
      <Slider.Slide title="5">E</Slider.Slide>
    </Slider>
  );
};

const styles = {
  shoppingCartList: {
    display: 'inline-flex',
    listStyle: 'none',
    padding: '0px',
    border: '1px solid black',
  },
  verticalList: {
    flexWrap: 'wrap',
    borderBottom: '0px',
  },
  horizontalList: {
    flexWrap: 'nowrap',
    borderRight: '0px',
  },
  shoppingCartListItem: {
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
    minWidth: '100px',
    width: '100%',
  },
  verticalListItem: {
    borderBottom: '1px solid black',
  },
  horizontalListItem: {
    borderRight: '1px solid black',
  },
};

const ShoppingCartContext = React.createContext();

function useShoppingCartContext() {
  const context = React.useContext(ShoppingCartContext);
  if (!context) {
    throw new Error(
      'Toggle compound components cannot be rendered outside the Toggle component',
    );
  }
  return context;
}

const getShopingCartStyle = ({ direction }) => {
  let listStyle;
  let listItemStyle;

  switch (direction) {
    case 'vertical':
      listStyle = { ...styles.shoppingCartList, ...styles.verticalList };
      listItemStyle = { ...styles.shoppingCartListItem, ...styles.verticalListItem };
      break;
    case 'horizontal':
      listStyle = { ...styles.shoppingCartList, ...styles.horizontalList };
      listItemStyle = { ...styles.shoppingCartListItem, ...styles.horizontalListItem };
      break;
    default:
      listStyle = styles.shoppingCartList;
      listItemStyle = styles.shoppingCartListItem;
  }

  return { listStyle, listItemStyle };
};

const ShoppingCart = ({ children, direction = 'vertical', onItemClick = () => null }) => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const { listStyle } = getShopingCartStyle({ direction });

  const clickItemHandle = useCallback((id) => {
    setActiveItemIndex(id);
    onItemClick(id);
  }, [onItemClick]);

  const value = useMemo(
    () => ({
      direction, activeItemIndex, onItemClick: clickItemHandle,
    }),
    [direction, activeItemIndex, clickItemHandle],
  );
  return (
    <ShoppingCartContext.Provider value={value}>
      <ul aria-orientation={direction} style={listStyle}>
        active: {activeItemIndex}
        {children}
      </ul>
    </ShoppingCartContext.Provider>
  );
};

const shoppingCartItemStyles = {
  shoppingCartItem: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: '10px',
  },
  shoppingCartItemActive: {
    backgroundColor: 'grey',
  },
};

const ShoppingCartItem = ({ children, id }) => {
  const {
    direction, activeItemIndex, onItemClick,
  } = useShoppingCartContext();
  const { listItemStyle } = getShopingCartStyle({ direction });
  const isActive = activeItemIndex === id;

  const itemStyle = isActive ? ({
    ...listItemStyle,
    backgroundColor: 'grey',
  }) : (
    listItemStyle
  );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      style={itemStyle}
      onClick={() => onItemClick(id)}
    >
      {children} {isActive.toString()}
    </div>
  );
};

const ShoppingCartExpandableItemStyles = {
  shoppingCartItem: {
    width: '100%',
  },
  label: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
  },
  labelActive: {
    backgroundColor: 'grey',
  },
  extendedDetails: {
    padding: '10px',
    borderTop: '1px solid grey',
  },
};

const ShoppingCartExpandableItem = ({ children, extendedDetails, id = Date.now() }) => {
  const { direction, activeItemIndex, onItemClick } = useShoppingCartContext();
  const { listItemStyle } = getShopingCartStyle({ direction });
  const isActive = activeItemIndex === id;

  const itemStyle = isActive ? ({
    ...listItemStyle,
    backgroundColor: 'grey',
  }) : (
    listItemStyle
  );

  const itemLabelStyle = isActive ? ({
    ...ShoppingCartExpandableItemStyles.label,
    ...ShoppingCartExpandableItemStyles.labelActive,
  }) : (
    ShoppingCartExpandableItemStyles.label
  );

  return (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      style={ShoppingCartExpandableItemStyles.shoppingCartItem}
      onClick={() => onItemClick(id)}
    >
      <div style={itemLabelStyle}>
        {children}
      </div>
      {isActive && (
        <div style={ShoppingCartExpandableItemStyles.extendedDetails}>
          - {extendedDetails}
        </div>
      )}
    </div>
  );
};

const ShoppingCartApp = () => (
  <ShoppingCart direction="vertical">
    <ShoppingCartItem id={1}>Eggs</ShoppingCartItem>
    <ShoppingCartItem id={2}>Ham</ShoppingCartItem>
    <ShoppingCartExpandableItem id={3} extendedDetails="Details to show when clicked">
      Bread
    </ShoppingCartExpandableItem>
  </ShoppingCart>
);

const StoragName = () => {
  const name = localStorage.getItem('name');
  const updateName = (e) => localStorage.setItem('name', e.target.value);
  return (
    <>
      <h1>{name}</h1>
      <input typer="text" value={name} onChange={updateName} />
    </>
  );
};

const SafeStorageName = () => {
  const [name, setName] = useState('');
  const updateName = (e) => setName(e.target.value);

  useEffect(() => {
    const storeName = localStorage.getItem('safe-name');
    if (storeName) {
      setName(storeName);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('safe-name', name);
  }, [name]);

  return (
    <>
      <h1>{name}</h1>
      <input typer="text" value={name} onChange={updateName} />
    </>
  );
};

const CollateralsApp = () => (
  <>
    <h1>Collaterals</h1>
    <StoragName />
    <SafeStorageName />
  </>
);

const RandomPage = () => (

  <div className="content">
    <h1 className="subtitle is-1">[WIP] Random</h1>
    <hr />
    <ToogleApp />
    <SliderApp />
    <ShoppingCartApp />
    <CollateralsApp />
  </div>
);

RandomPage.propTypes = {};

RandomPage.defaultProps = {};

export default RandomPage;
