/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
import React, {
  useCallback, useContext, useMemo, useRef, useState,
} from 'react';
import { useEffect } from 'react/cjs/react.development';
import './Lifecycle.css';

const Child = ({ text, onClick = () => null }) => {
  const [counter, setCounter] = useState(0);
  const handleClick = () => {
    setCounter((c) => c + 1);
    onClick();
  };
  return (
    <button className="button is-primary is-light mr-4" type="button" onClick={handleClick}>{text} {counter}</button>
  );
};

const ChildMemo = React.memo(({ text, onClick = () => null }) => {
  const [counter, setCounter] = useState(0);
  const handleClick = () => {
    setCounter((c) => c + 1);
    onClick();
  };
  return (
    <button className="button is-primary is-light mr-4" type="button" onClick={handleClick}>{text} {counter}</button>
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

  return (
    <div className="columns is-multiline">
      <div className="column is-12">
        <h4 className="subtitle is-6">{name}: {counter} (atualizado em {time})</h4>
        <p>
          Ao clicar nos botões em azul pode será gerado um novo render deste Componente Pai
          assim como seu componentes filhos que não estão memoizados da forma correta, mesmo
          que eles não usem o valor do contador do Componente Pai e não teriam a
          necessidade de sofrer um novo render
        </p>
        <button className="button is-link is-light mr-4" type="button" onClick={handleIncrease}>+</button>
        <button className="button is-link is-light mr-4" type="button" onClick={handleDecrease}>-</button>
      </div>
      <div className="column is-12">
        <p>
          Ao clicar nos botões abaixo pode conferir não ocorrerá o render do outro botão nem do
          Componente Pai, porém ao clicar nos botões em azul o botão memoizado não sofre um
          render desncessário.
        </p>
        <Child text={`Botão 1 - ${name}`} />
        <ChildMemo text={`Botão 1 com Memo - ${name}`} />
      </div>
      <div className="column is-12">
        <p>
          Os botões abaixo atualizam o contador do Componente Pai e assim causam um novo render
          nele e em todos seus componentes filhos sem memoização.
        </p>
        <Child text={`Botão 2 - ${name}`} onClick={handleIncrease} />
        <ChildMemo text={`Botão 2 com Memo - ${name}`} onClick={handleIncrease} />
      </div>
      <div className="column is-12">
        <p>
          Neste terceiro cenario nosso botão memoizado esta sofrendo o render sempre que o
          componente pai renderiza e isso ocorre pq apesar de memoizado sua prop <i>onClick</i> é
          uma função não memoizada com o useCallback e com isso ela será recriada a
          cada render fazendo com que o boptão entenda que é uma nova função e seja re-renderizada.
        </p>
        <Child text={`Botão 3 - ${name}`} onClick={handleDecrease} />
        <ChildMemo text={`Botão 3 com Memo - ${name}`} onClick={handleDecrease} />
      </div>
    </div>
  );
};

const LifecycleApp1 = () => (
  <div className="box">
    <h3 className="title is-4">Componente Pai</h3>
    <Component name="Componente Filho" />
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
    <button className="button is-primary is-light mr-4" type="button" onClick={handleClick}>{text} {counter}</button>
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
    <button className="button is-primary is-light mr-4" type="button" onClick={handleClick}>{text} {counter}</button>
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

  return (
    <div className="columns is-multiline">
      <div className="column is-12">
        <h4 className="subtitle is-6">{name}: {counter} (atualizado em {time})</h4>
        <p>
          Ao clicar nos botões em azul pode será gerado um novo render deste Componente Pai
          assim como seu coponentes filhos que não estão memoizados da forma correta, mesmo
          que eles não usem o valor do contador do Componente Pai e não teriam a
          necessidade de sofrer um novo render
        </p>
        <button className="button is-link is-light mr-4" type="button" onClick={handleIncrease}>+</button>
        <button className="button is-link is-light mr-4" type="button" onClick={handleDecrease}>-</button>
      </div>
      <div className="column is-12">
        <p>
          Ao clicar nos botões abaixo pode conferir sua independência, não causando render um
          ao outro ou no Componente Pai. Porém ao clicar nos botões em azul pdoe conferir que
          o botão memoizado não sofre um render desncessário enquanto o outro renderzida novamente.
        </p>
        <Child text={`Botão 1 - ${name}`} />
        <ChildMemo text={`Botão 1 com Memo - ${name}`} />
      </div>
      <div className="column is-12">
        <p>
          Os botões abaixo atualizam o contador do Componente Pai e assim causam um novo render
          nele e em todos seus componentes filhos sem memoização. Este exemplo torna evidente
          como o não uso ou mal uso da memoização podem causar renders inesperados.
        </p>
        <Child text={`Botão 2 - ${name}`} onClick={handleIncrease} />
        <ChildMemo text={`Botão 2 com Memo - ${name}`} onClick={handleIncrease} />
      </div>
      <div className="column is-12">
        <p>
          Neste terceiro cenario nosso botão memoizado esta sofrendo o render sempre que o
          componente pai renderiza e isso ocorre pq apesar de memoizado sua prop onClick é
          uma função não memoizada com o useCallback e isso faz com que ela seja recriada
          a cada render causando um novo render no botão memoizado que entende que houveram
          atualizações.
        </p>
        <Child text={`Botão 3 - ${name}`} onClick={handleDecrease} />
        <ChildMemo text={`Botão 3 com Memo - ${name}`} onClick={handleDecrease} />
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
  return useMemo(() => (
    <div className="columns is-multiline">
      <div className="column is-12">
        <h4 className="subtitle is-6">{name}: {counter} (atualizado em {time})</h4>
        <p>
          Ao clicar nos botões em azul pode será gerado um novo render deste Componente Pai
          assim como seu coponentes filhos que não estão memoizados da forma correta, mesmo
          que eles não usem o valor do contador do Componente Pai e não teriam a
          necessidade de sofrer um novo render
        </p>
        <button className="button is-link is-light mr-4" type="button" onClick={handleIncrease}>+</button>
        <button className="button is-link is-light mr-4" type="button" onClick={handleDecrease}>-</button>
      </div>
      <div className="column is-12">
        <p>
          Ao clicar nos botões abaixo pode conferir sua independência, não causando render um
          ao outro ou no Componente Pai. Porém ao clicar nos botões em azul pdoe conferir que
          o botão memoizado não sofre um render desncessário enquanto o outro renderzida novamente.
        </p>
        <Child text={`Botão 1 - ${name}`} />
        <ChildMemo text={`Botão 1 com Memo - ${name}`} />
      </div>
      <div className="column is-12">
        <p>
          Os botões abaixo atualizam o contador do Componente Pai e assim causam um novo render
          nele e em todos seus componentes filhos sem memoização. Este exemplo torna evidente
          como o não uso ou mal uso da memoização podem causar renders inesperados.
        </p>
        <Child text={`Botão 2 - ${name}`} onClick={handleIncrease} />
        <ChildMemo text={`Botão 2 com Memo - ${name}`} onClick={handleIncrease} />
      </div>
      <div className="column is-12">
        <p>
          Neste terceiro cenario nosso botão memoizado esta sofrendo o render sempre que o
          componente pai renderiza e isso ocorre pq apesar de memoizado sua prop onClick é
          uma função não memoizada com o useCallback e isso faz com que ela seja recriada
          a cada render causando um novo render no botão memoizado que entende que houveram
          atualizações.
        </p>
        <Child text={`Botão 3 - ${name}`} onClick={handleDecrease} />
        <ChildMemo text={`Botão 3 com Memo - ${name}`} onClick={handleDecrease} />
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
      <button className="button is-primary is-light mr-4" type="button" onClick={handleIncrease}>+</button>
      <button className="button is-primary is-light mr-4" type="button" onClick={handleDecrease}>-</button>
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
    <div className="box">
      <h3 className="title is-4">Componente Pai</h3>
      <GlobalContext.Provider value={value}>
        <Component2 name="component 1" />
        <Component2 name="component 2" />
        <Component2Optmized name="component 3" />
        <Component2Memo name="component 4" />
      </GlobalContext.Provider>
    </div>
  );
};

const ValueContext = React.createContext();
const OnChangeContext = React.createContext();

const LifecycleApp3 = () => {
  const [count, setCount] = useState(0);

  return (
    <OnChangeContext.Provider value={setCount}>
      <ValueContext.Provider value={count}>
        <Value />
        <Update />
      </ValueContext.Provider>
    </OnChangeContext.Provider>
  );
};

const Value = React.memo(() => {
  const value = useContext(ValueContext);
  return <div>{value}</div>;
});

const Update = React.memo(() => {
  const onChange = useContext(OnChangeContext);
  // eslint-disable-next-line react/button-has-type
  return <button className="button is-primary is-light mr-4" onClick={() => onChange((n) => n + 1)}>update</button>;
});

const RenderCounter = ({ children }) => {
  const renderCount = useRef(0);
  // the text will render to a random color for
  // each instance of the Message component
  const getColor = () => (Math.floor(Math.random() * 255));
  const style = {
    color: `rgb(${getColor()},${getColor()},${getColor()})`,
  };
  return (
    <div>
      <h4 style={style}>{children}<span> ({++renderCount.current})</span></h4>
    </div>
  );
};

const LifecyclePage = () => (
  <div className="content">
    <h1 className="subtitle is-1">[WIP] React Lifecycle</h1>
    <hr />
    <LifecycleApp1 />
    <LifecycleApp2 />
    {/* <LifecycleApp3 /> */}
  </div>
);

LifecyclePage.propTypes = {};

LifecyclePage.defaultProps = {};

export default LifecyclePage;
