/* eslint-disable react/prop-types */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Outlet,
  NavLink,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import ErrorBoundary from './pages/ErrorBoudary';
import Pooling from './pages/Pooling';
import WebWorker from './pages/WebWorker';
import Random from './pages/Random';
import Lifecycle from './pages/Lifecycle';
import Forms from './pages/Forms';
import logo from './logo.svg';
import './App.css';
import Fetch from './pages/Fetch';
import DynamicComponent from './pages/DynamicComponent';
import CoolPortal from './pages/CoolPortal';

const experiments = [
  {
    name: 'Error Boundary',
    path: '/error-boundary',
    iconClass: 'mdi-bug',
    description: 'Entendendo a aplicação pratica de error boundaries',
  },
  {
    name: 'Pooling',
    path: '/pooling',
    iconClass: 'mdi-clipboard-flow-outline',
    description: 'Testando a eficiencia de implementações diferentes de pooling',
  },
  {
    name: 'Web Worker',
    path: '/workers',
    iconClass: 'mdi-account-hard-hat',
    description: 'Aplicando web workers para mehoria de performance em páginas web',
  },
  {
    name: 'Lifecycle',
    path: '/lifecycle',
    iconClass: 'mdi-repeat-variant',
    description: 'Exemplificando o ciclo de vida do react',
  },
  {
    name: 'Forms',
    path: '/forms',
    iconClass: 'mdi-form-textbox',
    description: 'Validando formas eficientes para tratamento de formulários',
  },
  {
    name: 'Fetch',
    path: '/fetch',
    iconClass: 'mdi-post',
    description: 'Executando o fetch de diferentes formas',
  },
  {
    name: 'Cool Portal',
    path: '/cool-portal',
    iconClass: 'mdi-dock-window',
    description: 'Aplicação prática e exemplos criativos do uso de portais',
  },
  {
    name: 'Dynamic Component',
    path: '/dynamic',
    iconClass: 'mdi-puzzle',
    description: 'Criação de componentes dinamicos e suas aplicações práticas',
  },
  {
    name: 'Random',
    path: '/random',
    iconClass: 'mdi-dots-grid',
    description: 'Coletânea de experiencias genéricas e ainda sem tópico próprio',
  },
].sort((a, b) => (a.name < b.name ? -1 : 1));

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  const toggleMenu = () => setOpen((open) => !open);
  return (
    <nav className="navbar is-white">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <img src={logo} alt="React logo" height="44" width="44" />
        </Link>
        <div tabIndex="0" role="button" className="navbar-burger" onClick={toggleMenu} onKeyPress={toggleMenu}>
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className={`navbar-menu ${isOpen ? 'is-active' : ''}`}>
        <div className="navbar-start">
          <Link className="navbar-item" to="/">
            React LAB
          </Link>
          {isOpen && (
          <div className="navbar-item has-dropdown is-hoverable">
            <p className="navbar-link">
              Experiments
            </p>
            <div className="navbar-dropdown is-boxed">
              {experiments.map((exp) => (
                <NavLink
                  key={exp.path}
                  to={exp.path}
                  className={({ isActive }) => (isActive ? 'navbar-item is-active' : 'navbar-item')}
                >
                  <span className="icon">
                    <i className={`mdi ${exp.iconClass}`} />
                  </span> {exp.name}
                </NavLink>
              ))}

            </div>
          </div>
          )}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field is-grouped">
              <p className="control">
                <a className="bd-tw-button button" data-social-network="Twitter" data-social-action="tweet" data-social-target="https://bulma.io" target="_blank" href="https://twitter.com/intent/tweet?text=Bulma: a modern CSS framework based on Flexbox&amp;hashtags=bulmaio&amp;url=https://bulma.io&amp;via=jgthms" rel="noreferrer">
                  <span className="icon">
                    <i className="mdi mdi-twitter" />
                  </span>
                  <span>
                    Tweet
                  </span>
                </a>
              </p>
              <p className="control">
                <a className="button is-primary" href="https://github.com/michael-silva/react-lab">
                  <span className="icon">
                    <i className="mdi mdi-github" />
                  </span>
                  <span>Github</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const ExperimentCard = ({
  path, iconClass, title, subtitle, children,
}) => (
  <Link to={path}>
    <div className="card">
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <span className="icon is-large">
              <i className={`mdi mdi-48px ${iconClass}`} />
            </span>
          </div>
          <div className="media-content">
            <p className="title is-4">{title}</p>
            {subtitle && <p className="subtitle is-6">{subtitle}</p>}
          </div>
        </div>

        <div className="content">
          {children}
        </div>
      </div>
    </div>
  </Link>
);

const Home = () => (
  <>
    <section className="hero is-medium">
      <div className="hero-body">
        <div className="container has-text-centered">
          <p className="title">
            React LAB
          </p>
          <p className="subtitle">
            Um repositório de experiências práticas com reactjs
          </p>
        </div>
      </div>
    </section>
    <div className="columns is-multiline">
      {experiments.map((exp) => (
        <div key={exp.path} className="column is-one-quarter">
          <ExperimentCard title={exp.name} path={exp.path} iconClass={exp.iconClass}>
            {exp.description}
          </ExperimentCard>
        </div>
      ))}
    </div>
  </>
);

const Sidebar = ({ }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <aside className={`menu main-menu ${isHome ? 'menu-hidden' : ''}`}>
      <p className="menu-label">
        Experiments
      </p>
      <ul className="menu-list">
        {experiments.map((exp) => (
          <li key={exp.path}>
            <NavLink
              to={exp.path}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              <span className="icon">
                <i className={`mdi ${exp.iconClass}`} />
              </span> {exp.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

const Layout = () => {
  const location = useLocation();

  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage('fadeOut');
  }, [location, displayLocation]);

  return (
    <div className="columns mt-4">
      <div className="column is-3 is-hidden-mobile">
        <Sidebar />
      </div>
      <div className="column">
        <div
          className={`box ${transitionStage}`}
          onAnimationEnd={() => {
            if (transitionStage === 'fadeOut') {
              setTransistionStage('fadeIn');
              setDisplayLocation(location);
            }
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <Navbar />
    <div className="container is-fluid">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Layout />}>
          <Route path="/error-boundary" element={<ErrorBoundary />} />
          <Route path="/pooling" element={<Pooling />} />
          <Route path="/workers" element={<WebWorker />} />
          <Route path="/lifecycle" element={<Lifecycle />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/cool-portal" element={<CoolPortal />} />
          <Route path="/dynamic" element={<DynamicComponent />} />
          <Route path="/fetch" element={<Fetch />} />
          <Route path="/random" element={<Random />} />
        </Route>
      </Routes>

    </div>
  </Router>
);

export default App;
