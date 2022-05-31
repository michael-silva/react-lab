import propTypes from 'prop-types';
import { useLayoutEffect, useRef } from 'react';

const Code = ({ children, lang }) => {
  const ref = useRef();
  useLayoutEffect(() => {
    if (ref.current && window.hljs) {
      window.hljs.highlightElement(ref.current);
    }
  }, [ref]);

  return (
    <pre>
      <code ref={ref} className={`language-${lang}`}>
        {children}
      </code>
    </pre>
  );
};

Code.propTypes = {
  children: propTypes.oneOf([propTypes.element, propTypes.string]),
  lang: propTypes.string,
};

Code.defaultProps = {
  children: null,
  lang: 'javascript',
};

export default Code;
