/* eslint-disable react/button-has-type */
import ReactDOM from 'react-dom';
import {
  useState, useEffect, useCallback, useRef,
} from 'react';
import './CoolPortal.css';

function copyStyles(sourceDoc, targetDoc) {
  Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
    if (styleSheet.cssRules) {
      // for <style> elements
      const newStyleEl = sourceDoc.createElement('style');

      Array.from(styleSheet.cssRules).forEach((cssRule) => {
        // write the text of each rule into the body of the style element
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) {
      // for <link> elements loading CSS from a URL
      const newLinkEl = sourceDoc.createElement('link');

      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}

const MyWindowPortal = ({ children }) => {
  const containerRef = useRef();

  useEffect(() => {
    const containerEl = document.createElement('div');
    const externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200');
    copyStyles(document, externalWindow.document);

    externalWindow.document.body.appendChild(containerEl);
    containerRef.current = containerEl;
    return () => externalWindow.close();
  }, []);

  return containerRef.current ? ReactDOM.createPortal(children, containerRef.current) : false;
};

const CoolPortal = () => {
  const [counter, setCounter] = useState(0);
  const [showWindowPortal, setShowWindowPortal] = useState(false);

  useEffect(() => {
    window.setInterval(() => {
      setCounter((c) => c + 1);
    }, 1000);
  }, []);

  const toggleWindowPortal = useCallback(() => {
    setShowWindowPortal((show) => !show);
  }, []);

  return (
    <div className="root" data-testid="CoolPortal">
      <h1>Counter: {counter}</h1>

      <button onClick={toggleWindowPortal}>
        {showWindowPortal ? 'Close the' : 'Open a'} Portal
      </button>

      {showWindowPortal && (
        <MyWindowPortal>
          <h1>Counter in a portal: {counter}</h1>
          <p>Even though I render in a different window, I share state!</p>

          <button onClick={() => setShowWindowPortal(false)}>Close me!</button>
        </MyWindowPortal>
      )}
    </div>
  );
};

CoolPortal.propTypes = {};

CoolPortal.defaultProps = {};

export default CoolPortal;
