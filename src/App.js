import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import ErrorBoundary from './pages/ErrorBoudary';
import Pooling from './pages/Pooling';
import WebWorker from './pages/WebWorker';
import Random from './pages/Random';
import Lifecycle from './pages/Lifecycle';
import logo from './logo.svg';
import './App.css';

const Home = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit
        <code>src/App.js</code>
        and save to reload.
      </p>
      <nav>
        <ul>
          <li>
            <Link to="/error-boundary">Error Boundary</Link>
          </li>
          <li>
            <Link to="/pooling">Pooling</Link>
          </li>
          <li>
            <Link to="/workers">Web Worker</Link>
          </li>
          <li>
            <Link to="/lifecycle">Lifecycle</Link>
          </li>
          <li>
            <Link to="/random">Random</Link>
          </li>
        </ul>
      </nav>
    </header>
  </div>
);

const App = () => (
  <Router>
    <Routes>
      <Route path="/error-boundary" element={<ErrorBoundary />} />
      <Route path="/pooling" element={<Pooling />} />
      <Route path="/workers" element={<WebWorker />} />
      <Route path="/lifecycle" element={<Lifecycle />} />
      <Route path="/random" element={<Random />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>
);

export default App;
