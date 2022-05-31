/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import './DynamicComponent.css';
import { useState, createElement } from 'react';
import Code from '../../components/code';

const Step1 = () => (
  <>
    <h1 className="title">Step 1</h1>
    <h2 className="subtitle">step description</h2>
  </>
);

const Step2 = () => (
  <div className="content">
    <h1>Step 2</h1>
    <p>step description</p>
  </div>
);

const Step3 = () => (
  <div className="content">
    <h1>Step 3</h1>
    <a href="#link">link</a>
  </div>
);

const DynamicComponentGeneration = () => {
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
  const handleGenerateButtonClick = () => {
    const id = Date.now();
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    // eslint-disable-next-line react/no-unstable-nested-components
    const Generated = () => <><h1 className="title">Generated</h1><h2 style={{ color: `#${randomColor}` }} className="subtitle">{id}</h2></>;
    setComponents((comps) => [...comps, Generated]);
  };

  const SpecificStep = components[index];
  return (
    <div className="card">
      <div className="card-content">
        <SpecificStep />
      </div>
      <div className="card-footer">
        <button disabled={!canPrev} onClick={handlePrev} className="card-footer-item">
          Prev
        </button>

        <button disabled={!canNext} onClick={handleNext} className="card-footer-item">
          Next
        </button>

        <button onClick={handleGenerateButtonClick} className="card-footer-item">Gerar Novo</button>
      </div>
    </div>
  );
};

const NotificationComponent = ({ text }) => (
  <div className="notification">
    {text}
  </div>
);

const QuoteComponent = ({ text, author }) => (
  <div className="card">
    <div className="card-content">
      <p className="title is-5">“{text}”</p>
      <p className="subtitle is-6">{author}</p>
    </div>
  </div>
);

const PostComponent = ({
  content, name, socialname, datetime, tags,
}) => (
  <div className="card">
    <div className="card-image">
      <div className="card-content">
        <div className="content">
          <p><strong>{name}</strong> (<small>@{socialname}</small>)</p>
          <p>{content}
            {tags.map((tag) => <a href="#">#{tag}</a>)}
            <br />
            <time dateTime={datetime}>{new Date(datetime).toLocaleDateString()}</time>
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ListComponents = {
  notification: NotificationComponent,
  quote: QuoteComponent,
  post: PostComponent,
};

const items = [{
  type: 'quote',
  text: 'There are two hard things in computer science: cache invalidation, naming things, and off-by-one errors.',
  author: 'Antony Atwood',
}, {
  type: 'post',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.',
  name: 'John Smith',
  socialname: 'johnsmith',
  datetime: '2022-01-02',
  tags: ['css', 'html'],
}, {
  type: 'notification',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.',
}, {
  type: 'quote',
  text: 'There are two hard things in computer science: cache invalidation, naming things, and off-by-one errors.',
  author: 'Jeff Atwood',
}, {
  type: 'post',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.',
  name: 'Mike Jordan',
  socialname: 'mikejord',
  datetime: '2022-01-03',
  tags: ['ts', 'responsive'],
}, {
  type: 'notification',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.',
}];

const ListItemComponent = ({ item }) => {
  // component does exist
  if (typeof ListComponents[item.type] !== 'undefined') {
    return createElement(ListComponents[item.type], {
      ...item,
    });
  }
  return null;
};

const DynamicList = () => (
  <div className="container">
    <h2>Lista de posts dinâmicos</h2>
    <hr />
    {/* eslint-disable-next-line react/no-array-index-key */}
    {items.map((item, index) => <div className="mb-4"><ListItemComponent key={index} item={item} /></div>)}
  </div>
);

const TextField = ({
  name, value, onChange, label, placeholder,
}) => (
  <div className="field">
    <label htmlFor={name} className="label">{label}</label>
    <div className="control">
      <input id={name} name={name} value={value || ''} onChange={onChange} className="input" type="text" placeholder={placeholder} />
    </div>
  </div>
);

const SelectField = ({
  name, value, onChange, label, options,
}) => (
  <div className="field">
    <label htmlFor={name} className="label">{label}</label>
    <div className="control">
      <div className="select">
        <select id={name} name={name} value={value || ''} onChange={onChange}>
          {options.map((option) => <option>{option}</option>)}
        </select>
      </div>
    </div>
  </div>
);

const TextareaField = ({
  name, value, onChange, label, placeholder,
}) => (
  <div className="field">
    <label htmlFor={name} className="label">{label}</label>
    <div className="control">
      <textarea id={name} name={name} value={value || ''} onChange={onChange} className="textarea" placeholder={placeholder} />
    </div>
  </div>
);

const FormComponents = {
  text: TextField,
  textarea: TextareaField,
  select: SelectField,
};

const formMetadata = [{
  type: 'text',
  name: 'name',
  label: 'Nome',
  placeholder: 'Nome Completo',
}, {
  type: 'text',
  name: 'nick',
  label: 'Apelido',
  placeholder: '',
}, {
  type: 'select',
  name: 'state',
  label: 'Estado Civil',
  options: ['Casado', 'Solteiro'],
}, {
  type: 'textarea',
  name: 'message',
  label: 'Mensagem',
  placeholder: 'Mensagem até 250 caracteres',
}];

const FormItemComponent = ({ input, ...rest }) => {
  // component does exist
  if (typeof FormComponents[input.type] !== 'undefined') {
    return createElement(FormComponents[input.type], {
      ...input,
      ...rest,
    });
  }
  return null;
};

const DynamicForm = () => {
  const [formValues, setFormValues] = useState({});
  const handleSubmit = () => {
    alert(JSON.stringify(formValues));
  };
  return (
    <div className="container">
      <h2>Formulário dinâmico</h2>
      <hr />
      {formMetadata.map((input) => (
        <FormItemComponent
          key={input.name}
          input={input}
          value={formValues[input.name]}
          onChange={(e) => console.log(e.target.value)
            || setFormValues({ ...formValues, [input.name]: e.target.value })}
        />
      ))}
      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link" onClick={handleSubmit}>Submit</button>
        </div>
        <div className="control">
          <button className="button is-link is-light">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const DynamicComponent = () => (
  <div className="content">
    <h1 className="subtitle is-1">Dynamic Component</h1>
    <hr />
    <p>
      Apesar de não recomendado é possivel criar componentes em tempo de execução,
      dentro do click de um botão por exemplo:
    </p>
    <DynamicComponentGeneration />
    <Code>
      {`const DynamicComponentGeneration = () => {
  const [index, setIndex] = useState(0);
  const [components, setComponents] = useState([]);
  const canPrev = index > 0;
  const canNext = index < components.length - 1;

  const handleNext = () => {
    setIndex((i) => i + 1);
  };
  const handlePrev = () => {
    setIndex((i) => i - 1);
  };
  const handleGenerateButtonClick = () => {
    const id = Date.now();
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const Generated = () => <><h1 className="title">Generated</h1><h2 style={{ color: randomColor }} className="subtitle">{id}</h2></>;
    setComponents((comps) => [...comps, Generated]);
  };

  const CurrentStep = components[index];
  return (
    <div className="card">
      <div className="card-content">
        <CurrentStep />
      </div>
      <div className="card-footer">
        <button disabled={!canPrev} onClick={handlePrev} className="card-footer-item">Prev</button>
        <button disabled={!canNext} onClick={handleNext} className="card-footer-item">Next</button>
        <button onClick={handleGenerateButtonClick} className="card-footer-item">Gerar Novo</button>
      </div>
    </div>
  );
};
`}
    </Code>
    <p>
      Esta aplicação porém parece não ter aplicação real em nenhum cenário prático,
      já que o recomendado em uma situação similar a este exemplo seria salvar apenas os dados das
      props no estado e passar esses dados para o componente de forma dinâmica,
      conforme o exemplo abaixo:
    </p>
    <Code>
      {`const GeneratedComponent = ({ id, randomColor }) => <><h1 className="title">Generated</h1><h2 style={{ color: randomColor }} className="subtitle">{id}</h2></>;
const DynamicComponentGeneration = () => {
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState([]);
  const canPrev = index > 0;
  const canNext = index < items.length - 1;

  const handleNext = () => {
    setIndex((i) => i + 1);
  };
  const handlePrev = () => {
    setIndex((i) => i - 1);
  };
  const handleGenerateButtonClick = () => {
    const id = Date.now();
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    setItems((items) => [...items, { id, randomColor }]);
  };

  return (
    <div className="card">
      <div className="card-content">
        <GeneratedComponent {...items[index]} />
      </div>
      <div className="card-footer">
        <button disabled={!canPrev} onClick={handlePrev} className="card-footer-item">Prev</button>
        <button disabled={!canNext} onClick={handleNext} className="card-footer-item">Next</button>
        <button onClick={handleGenerateButtonClick} className="card-footer-item">Gerar Novo</button>
      </div>
    </div>
  );
};`}
    </Code>
    <p>
      Outro exemplo muito mais favoravel e até recomendado para o uso de componentes dinâmicos
      seriam a renderização de componentes através de metadados, como por exemplo um formulário
      dinâmico, uma tabela genérica de dados ou uma lista de posts de uma página que podem ter
      diferentes formatos, conforme os exemplos abaixo:
    </p>
    <DynamicForm />
    <br />
    <DynamicList />
  </div>
);

DynamicComponent.propTypes = {};

DynamicComponent.defaultProps = {};

export default DynamicComponent;
