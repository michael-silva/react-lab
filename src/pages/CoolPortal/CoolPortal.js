/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import ReactDOM from 'react-dom';
import {
  useState, useEffect, forwardRef, useRef,
} from 'react';
import Code from '../../components/code';
import './CoolPortal.css';

const WindowPortal = forwardRef(({
  children, width, height, onClose, cssFiles,
}, ref) => {
  const containerRef = useRef();

  useEffect(() => {
    const containerEl = document.createElement('div');
    const externalWindow = window.open('', '', `width=${width},height=${height}`);

    cssFiles.forEach((file) => {
      const newLinkEl = externalWindow.document.createElement('link');
      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = file;
      externalWindow.document.head.appendChild(newLinkEl);
    });

    externalWindow.document.body.appendChild(containerEl);
    externalWindow.onbeforeunload = onClose;
    containerRef.current = containerEl;
    // eslint-disable-next-line no-param-reassign
    ref.current = externalWindow;
    return () => externalWindow.close();
  }, []);

  return containerRef.current ? ReactDOM.createPortal(children, containerRef.current) : false;
});

const initialEmails = [
  {
    subject: 'Security email', from: 'security@email.com', content: 'Automatic security email',
  },
  {
    subject: 'Alert email', from: 'alert@email.com', content: 'Automatic alert email',
  },
  {
    subject: 'Test email', from: 'test@email.com', content: 'Automatic test email',
  },
  {
    subject: 'Offer email', from: 'offer@email.com', content: 'Automatic offer email',
  },
  {
    subject: 'Email', from: 'random@email.com', content: 'Random email',
  },
];

const CSS_FILES = ['https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css', 'https://cdn.jsdelivr.net/npm/@mdi/font@6.6.96/css/materialdesignicons.min.css'];

const WindowSample = () => {
  const ref = useRef();
  const [emails, setEmails] = useState(initialEmails);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [datetime, setDateTime] = useState(Date.now());
  const currentDate = new Date(datetime);
  const currentEmail = emails[selectedIndex];

  useEffect(() => {
    window.setInterval(() => {
      setDateTime(Date.now());
    }, 1000);
  }, []);

  const handleSelect = (index) => {
    if (ref.current && currentEmail) {
      ref.current.focus();
    }
    setSelectedIndex(index);
    if (!emails[index].isRead) {
      emails[index].isRead = true;
      setEmails(emails);
    }
  };
  const handleClose = () => setSelectedIndex(-1);

  return (
    <nav className="panel">
      <p className="panel-heading">
        Emails
      </p>
      <div className="panel-block">{currentDate.toLocaleDateString()} - {currentDate.toLocaleTimeString()}</div>
      <div className="panel-block">
        <p className="control has-icons-left">
          <input className="input" type="text" placeholder="Search" />
          <span className="icon is-left">
            <i className="mdi mdi-search" aria-hidden="true" />
          </span>
        </p>
      </div>
      {emails.map((email, index) => (
        <a
          href="#"
          className="panel-block"
          onClick={(e) => {
            e.preventDefault();
            handleSelect(index);
          }}
        >
          <span className="panel-icon">
            <i className={!email.isRead ? 'mdi mdi-email' : 'mdi mdi-email-open'} aria-hidden="true" />
          </span>
          <strong>{email.subject}</strong>&nbsp; (<small>{email.from}</small>)
        </a>
      ))}

      <div className="panel-block">
        <button className="button is-link is-outlined is-fullwidth">
          Reset all filters
        </button>
      </div>

      {currentEmail && (
      <WindowPortal width={600} height={400} ref={ref} onClose={handleClose} cssFiles={CSS_FILES}>
        <div className="box">
          <article className="media">
            <div className="media-content">
              <div className="content">
                <p className="title is-5">{currentEmail.subject}</p>
                <p className="subtitle is-6">{currentEmail.from}</p>
              </div>
              <div className="content">{currentEmail.content}</div>
              <nav className="level is-mobile">
                <div className="level-left">
                  <a className="level-item">
                    <span className="icon is-small"><i className="mdi mdi-reply" /></span>
                  </a>
                  <a className="level-item">
                    <span className="icon is-small"><i className="mdi mdi-tweet" /></span>
                  </a>
                  <a className="level-item">
                    <span className="icon is-small"><i className="mdi mdi-heart" /></span>
                  </a>
                  <span className="level-item">
                    {currentDate.toLocaleDateString()} - {currentDate.toLocaleTimeString()}
                  </span>
                </div>
              </nav>
            </div>
            <div className="media-right">
              <button className="delete" onClick={handleClose} />
            </div>
          </article>
        </div>
      </WindowPortal>
      )}
    </nav>
  );
};

// eslint-disable-next-line max-len
const Portal = ({ children, container }) => (container ? ReactDOM.createPortal(children, container) : null);
const Modal = ({
  open, onClose, children, hiddenBackground,
}) => (
  <Portal container={document.body}>
    <div className={`modal ${open ? 'is-active' : ''}`}>
      {!hiddenBackground && <div aria-hidden="true" className="modal-background" onClick={onClose} />}
      <div className="modal-content">{children}</div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose} />
    </div>
  </Portal>
);

const ModalSample = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="block">
      <button className="button is-primary" onClick={() => setOpen(true)}>Abrir Modal</button>
      <Modal open={isOpen} onClose={() => setOpen(false)}>
        <div className="box mx-4">
          <article className="media">
            <div className="media-content">
              <div className="content">
                <p>
                  <strong>John Smith</strong> <small>@johnsmith</small> <small>31m</small>
                  <br />
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aenean efficitur sit amet massa fringilla egestas.
                  Nullam condimentum luctus turpis.
                </p>
              </div>
            </div>
          </article>
        </div>
      </Modal>
    </div>
  );
};

const Notification = ({
  open, onClose, children, className, position, duration = 3000,
}) => {
  const style = position === 'top' ? { top: '10%' } : { bottom: '10%' };

  useEffect(() => {
    if (!open) return undefined;
    const timeId = setTimeout(onClose, duration);
    return () => clearTimeout(timeId);
  }, [open]);

  return (
    open && (
    <Portal container={document.body}>
      <div style={style} className={`notification-custom notification ${className}`}>
        <button className="delete" onClick={onClose} aria-label="Close notification" />
        {children}
      </div>
    </Portal>
    )
  );
};

const useNotification = () => {
  const [isOpen, setOpen] = useState(false);
  const show = () => setOpen(true);
  const hide = () => setOpen(false);
  return {
    show, hide, isOpen,
  };
};

const NotificationSample = () => {
  const { show, hide, isOpen } = useNotification();

  return (
    <div className="block">
      <button className="button is-primary" onClick={show}>Abrir Notificação</button>
      <Notification className="is-light is-info" position="top" open={isOpen} onClose={hide}>
        Primar lorem ipsum dolor sit amet, consectetur
        adipiscing elit lorem ipsum dolor. <strong>Pellentesque risus mi</strong>
      </Notification>
    </div>
  );
};

const ActionBar = () => {
  const [active, setActive] = useState(false);
  const toogle = (e) => {
    if (e) e.preventDefault();
    setActive((a) => !a);
  };
  return (
    (
      <Portal container={document.body}>
        <nav className={`navbar actionbar ${active ? 'is-active' : ''}`} role="navigation" aria-label="main navigation">

          <div id="navbarBasicExample" className="navbar-menu is-active">
            <div className="navbar-start">
              <a href="#" className="navbar-item" onClick={toogle}>
                <strong>Barra de ações</strong> <small>criada através de um Portal</small>
                <span className="icon">
                  <i className={active ? 'mdi mdi-arrow-down-drop-circle-outline' : 'mdi mdi-arrow-up-drop-circle-outline'} aria-hidden="true" />
                </span>
              </a>
            </div>

            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <button className="button is-primary">
                    <strong>Close</strong>
                  </button>
                  <button className="button is-light">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </Portal>
    )
  );
};

const CoolPortal = () => (
  <div className="content">
    <h1 className="subtitle is-1">Portal</h1>
    <hr />
    <p>Implementações usando <strong>React Portals</strong> , para mais detalhes pode conferir a <a href="https://pt-br.reactjs.org/docs/portals.html" targe="blank">documentação oficial.</a></p>
    <p>
      Uma abordagem bem interessante é a criação de um componente Portal para usar
      portais de forma mais declarativa dentro do JSX. Segue um exemplo:
    </p>
    <Code>
      {`const Portal = ({ children, container }) => {
  return (container ? ReactDOM.createPortal(children, container) : null);
};
// Exemplo de uso
<Portal container={document.body}>
  Conteudo carregado no fim da página
</Portal>`}
    </Code>
    <p>
      Os casos mais comuns são modais, tooltips, popovers e outros componentes que precisam ser
      renderizados acima dos elementos atuais da página para serem posicionados de forma
      absoluta ou relativa a outro elemento fora do contexto atual. Seguem alguns exemplos:
    </p>
    <Code>
      {`//Implementação de modal usando Portal
const Modal = ({ open, onClose, children, hiddenBackground }) => (
  <Portal container={document.body}>
    <div className={open ? 'modal is-active' : 'modal'}>
      {!hiddenBackground && <div aria-hidden="true" className="modal-background" onClick={onClose} />}
      <div className="modal-content">{children}</div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose} />
    </div>
  </Portal>
);
// Exemplo de uso
<Modal open>
  Conteudo da modal
</Modal>
`}
    </Code>
    <ModalSample />

    <Code>
      {`//Implementação de notificações usando Portal
const Notification = ({ open, onClose, children, position }) => {
  const style = position === 'top' ? { top: '10%' } : { bottom: '10%' };
  return (
    open && (
    <Portal container={document.body}>
      <div style={style} className='notification-custom notification'>
        <button className="delete" onClick={onClose} aria-label="Close notification" />
        {children}
      </div>
    </Portal>
    )
  );
};
// Exemplo de uso
<Notification position="top" open>
  Conteudo da notificação
</Notification>
`}
    </Code>
    <NotificationSample />
    <p>
      Apesar de interessante estes exemplos, dificilmente eles serão implementados manualmente em
      um projeto real, nem recomendo isso, pois para todos estes cenários existem libs excelentes.
    </p>
    <p>
      Os casos mais comuns que ja encontrei para o uso de <strong>Portals</strong>
      são barras de ação fixa no fim da página, como a implementada nesta página,
      botões de voltar ao topo em páginas longas, janelas de chat que abrem por cima
      do conteúdo da página, entre outros outros usos bem parecidos.
    </p>
    <ActionBar />
    <p>
      Navegando na internet encontrei um exemplo bem diferente do convencional que é
      o uso de Portals para manipulação de janelas de popup, conforme este
      <a href="https://medium.com/hackernoon/using-a-react-16-portal-to-do-something-cool-2a2d627b0202" target="blank"> tutorial</a>. <br />
      E com base nele implementei o exemplo da caixa de email abaixo.
    </p>
    <WindowSample />
  </div>
);

CoolPortal.propTypes = {};

CoolPortal.defaultProps = {};

export default CoolPortal;
