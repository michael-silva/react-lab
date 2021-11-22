/* eslint-disable react/button-has-type */
import './DynamicComponent.css';
import { useMemo, useState } from 'react';

const Step1 = () => (
  <h1>Step 1</h1>
);

const Step2 = () => (
  <h1>Step 2</h1>
);

const Step3 = () => (
  <h1>Step 3</h1>
);

const DynamicComponent = () => {
  const [index, setIndex] = useState(0);
  const [components, setComponents] = useState([Step1, Step2, Step3]);
  const canPrev = index > 0;
  const canNext = index < components.length - 1;

  const handleNext = () => {
    setIndex((i) => i + 1);
  };
  const handlePrev = () => {
    setIndex((i) => i - 1);
  };
  const handleGenerate = () => {
    // eslint-disable-next-line react/no-unstable-nested-components
    const Generated = () => {
      const id = useMemo(() => Date.now(), []);
      return <h1>Generated {id}</h1>;
    };
    setComponents((comps) => [...comps, Generated]);
  };

  const SpecificStep = components[index];
  return (
    <>
      <SpecificStep />
      <div>
        <button disabled={!canPrev} onClick={handlePrev}>
          Prev
        </button>

        <button disabled={!canNext} onClick={handleNext}>
          Next
        </button>

        <button onClick={handleGenerate}>Generate</button>
      </div>
    </>
  );
};

DynamicComponent.propTypes = {};

DynamicComponent.defaultProps = {};

export default DynamicComponent;
