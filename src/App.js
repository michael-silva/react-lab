import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import ErrorBoundary from './pages/ErrorBoudary';
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
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
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
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>
);

export default App;
