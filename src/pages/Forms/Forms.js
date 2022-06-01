/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import './Forms.css';
import {
  FieldArray,
  Form, Formik, useField, useFormik, useFormikContext,
} from 'formik';
import * as Yup from 'yup';
import React, {
  useCallback, useContext, useMemo, useState,
} from 'react';
import { useEffect } from 'react/cjs/react.development';
import Code from '../../components/code';

const signupSchema = Yup.object({
  firstName: Yup.string()
    .max(15, 'Must be 15 characters or less')
    .required('Required'),
  lastName: Yup.string()
    .max(20, 'Must be 20 characters or less')
    .required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
});
const signupInitialValues = {
  firstName: '',
  lastName: '',
  email: '',
};
const SignupForm = () => {
  const formik = useFormik({
    initialValues: signupInitialValues,
    validationSchema: signupSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form className="box" onSubmit={formik.handleSubmit}>
      <h1 className="subtitle is-5">Signup Form</h1>
      <div className="field">
        <label className="label" htmlFor="firstName">First Name</label>
        <div className="control">
          <input
            className={`input ${formik.errors.firstName ? 'is-danger' : ''}`}
            id="firstName"
            name="firstName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
          />
        </div>
        {formik.touched.firstName && formik.errors.firstName ? (
          <p className="help is-danger">{formik.errors.firstName}</p>
        ) : null}
      </div>

      <div className="field">
        <label className="label" htmlFor="lastName">Last Name</label>
        <div className="control">
          <input
            className={`input ${formik.errors.lastName ? 'is-danger' : ''}`}
            id="lastName"
            name="lastName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
          />
        </div>
        {formik.touched.lastName && formik.errors.lastName ? (
          <p className="help is-danger">{formik.errors.lastName}</p>
        ) : null}
      </div>

      <div className="field">
        <label className="label" htmlFor="email">Email Address</label>
        <div className="control">
          <input
            className={`input ${formik.errors.email ? 'is-danger' : ''}`}
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
        </div>
        {formik.touched.email && formik.errors.email ? (
          <p className="help is-danger">{formik.errors.email}</p>
        ) : null}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-primary">Submit</button>
        </div>
        <div className="control">
          <button type="button" className="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  );
};

const MyTextInput = React.memo(({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <div className="field">
      <label className="label" htmlFor={props.id || props.name}>{label}</label>
      <div className="control">
        <input
          className={`input ${meta.error ? 'is-danger' : ''}`}
          type="text"
          {...field}
          {...props}
        />
      </div>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
});

const MyCheckbox = React.memo(({ children, ...props }) => {
  // React treats radios and checkbox inputs differently other input types, select, and textarea.
  // Formik does this too! When you specify `type` to useField(), it will
  // return the correct bag of props for you -- a `checked` prop will be included
  // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  return (
    <div className="field">
      <div className="control">
        <label className="checkbox">
          <input type="checkbox" {...field} {...props} />
          {children}
        </label>
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    </div>
  );
});

const MySelect = React.memo(({ label, children, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="field">
      <label className="label" htmlFor={props.id || props.name}>{label}</label>
      <div className="control">
        <div className="select">
          <select {...field} {...props}>{children}</select>
          {meta.touched && meta.error ? (
            <div className="error">{meta.error}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

const signup2Schema = Yup.object({
  firstName: Yup.string()
    .max(15, 'Must be 15 characters or less')
    .required('Required'),
  lastName: Yup.string()
    .max(20, 'Must be 20 characters or less')
    .required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  acceptedTerms: Yup.boolean()
    .required('Required')
    .oneOf([true], 'You must accept the terms and conditions.'),
  jobType: Yup.string()
    .oneOf(
      ['designer', 'development', 'product', 'other'],
      'Invalid Job Type',
    )
    .required('Required'),
});
const signup2InitialValues = {
  firstName: '',
  lastName: '',
  email: '',
  acceptedTerms: false, // added for our checkbox
  jobType: '', // added for our select
};
const SignupForm2 = () => {
  const handleSubmit = useCallback((values) => {
    alert(JSON.stringify(values, null, 2));
  }, []);

  return (
    <Formik
      initialValues={signup2InitialValues}
      validationSchema={signup2Schema}
      onSubmit={handleSubmit}
    >
      <Form className="box">
        <h1 className="subtitle is-5">Signup Form</h1>
        <MyTextInput
          label="First Name"
          name="firstName"
          type="text"
          placeholder="Jane"
        />

        <MyTextInput
          label="Last Name"
          name="lastName"
          type="text"
          placeholder="Doe"
        />

        <MyTextInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="jane@formik.com"
        />

        <MySelect label="Job Type" name="jobType">
          <option value="">Select a job type</option>
          <option value="designer">Designer</option>
          <option value="development">Developer</option>
          <option value="product">Product Manager</option>
          <option value="other">Other</option>
        </MySelect>

        <MyCheckbox name="acceptedTerms">
          I accept the terms and conditions
        </MyCheckbox>

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-primary">Submit</button>
          </div>
          <div className="control">
            <button type="button" className="button is-link is-light">Cancel</button>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

const friendsInitialValues = {
  friends: [
    {
      name: '',
      email: '',
    },
  ],
};

const InviteFriends = () => (
  <Formik
    initialValues={friendsInitialValues}
    onSubmit={async (values) => {
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 500));
      alert(JSON.stringify(values, null, 2));
    }}
  >
    {({ values }) => (
      <Form className="box">
        <h1 className="subtitle is-5">Invite friends</h1>
        <FieldArray name="friends">
          {({ insert, remove, push }) => (
            <div>
              {values.friends.length > 0
                  && values.friends.map((friend, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div className="columns" key={index}>
                      <div className="column">
                        <MyTextInput
                          label="Name"
                          name={`friends.${index}.name`}
                          type="text"
                          placeholder="Jane Doe"
                        />

                      </div>
                      <div className="column">
                        <MyTextInput
                          label="Email"
                          name={`friends.${index}.email`}
                          type="email"
                          placeholder="jane@formik.com"
                        />
                      </div>
                      <div className="column">
                        <button
                          aria-label="Delete"
                          type="button"
                          className="delete"
                          onClick={() => remove(index)}
                        />
                      </div>
                    </div>
                  ))}

              <div className="field mb-4">
                <div className="control">
                  <button type="button" className="button is-success" onClick={() => push({ name: '', email: '' })}>Add Friend</button>
                </div>
              </div>
            </div>
          )}
        </FieldArray>

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-primary">Invite</button>
          </div>
          <div className="control">
            <button type="button" className="button is-link is-light">Cancel</button>
          </div>
        </div>
      </Form>
    )}
  </Formik>
);

async function fetchNewTextC(a, b) {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((r) => setTimeout(r, 500));
  return `${a}:${b}`;
}

const ResultField = ({ label, ...props }) => {
  const {
    values: { textA, textB },
    setFieldValue,
  } = useFormikContext();
  const [field, meta] = useField(props);

  useEffect(() => {
    let isCurrent = true;
    // your business logic around when to fetch goes here.
    if (textA.trim() !== '' && textB.trim() !== '') {
      fetchNewTextC(textA, textB).then((textC) => {
        if (isCurrent) {
          // prevent setting old values
          setFieldValue(props.name, textC);
        }
      });
    }
    return () => {
      isCurrent = false;
    };
  }, [textB, textA, setFieldValue, props.name]);

  return (
    <div className="field">
      <label className="label" htmlFor={props.id || props.name}>{label}</label>
      <div className="control">
        <input className="input" disabled {...props} {...field} />
      </div>
      {Boolean(meta.touched && meta.error) ?? <div>{meta.error.toString()}</div>}
    </div>
  );
};

const LinkedForm = () => {
  const initialValues = { textA: '', textB: '', textC: '' };
  const handleSubmit = useCallback((values) => {
    alert(JSON.stringify(values, null, 2));
  }, []);
  console.log('LinkedForm');
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form className="box">
        <h1 className="subtitle is-5">Linked fields</h1>
        <MyTextInput
          label="textA"
          name="textA"
        />

        <MyTextInput
          label="textB"
          name="textB"
        />

        <ResultField
          label="textC"
          name="textC"
        />

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-primary">Submit</button>
          </div>
          <div className="control">
            <button type="button" className="button is-link is-light">Cancel</button>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

// eslint-disable-next-line max-len
const getYupErrors = ({ inner }) => inner.reduce((prev, curr) => ({ ...prev, [curr.path]: curr.errors }), {});

const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    // eslint-disable-next-line no-shadow
    setValues((values) => ({ ...values, [e.target.name]: e.target.value }));
  }, []);

  const handleBlur = useCallback((e) => {
    // eslint-disable-next-line no-shadow
    setTouched((touched) => ({ ...touched, [e.target.name]: true }));
  }, []);

  useEffect(() => {
    const validation = () => {
      signupSchema.validate(values, { abortEarly: false })
        .catch((yupValidation) => setErrors(getYupErrors(yupValidation)));
    };
    validation();
  }, [values]);

  return {
    handleChange, handleBlur, values, errors, touched,
  };
};

const SignupFormSimple = () => {
  const {
    values, errors, touched, handleChange, handleBlur,
  } = useForm(signupInitialValues);

  const handleSubmit = useCallback(() => {
    alert(JSON.stringify(values, null, 2));
  }, [values]);

  console.log('SignupFormSimple');
  return (
    <form className="box" onSubmit={handleSubmit}>
      <h1 className="subtitle is-5">Signup Form</h1>
      <div className="field">
        <label className="label" htmlFor="firstName">First Name</label>
        <div className="control">
          <input
            className={`input ${errors.firstName ? 'is-danger' : ''}`}
            id="firstName"
            name="firstName"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.firstName}
          />
        </div>
        {touched.firstName && errors.firstName ? (
          <p className="help is-danger">{errors.firstName}</p>
        ) : null}
      </div>

      <div className="field">
        <label className="label" htmlFor="lastName">Last Name</label>
        <div className="control">
          <input
            className={`input ${errors.lastName ? 'is-danger' : ''}`}
            id="lastName"
            name="lastName"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.lastName}
          />
        </div>
        {touched.lastName && errors.lastName ? (
          <p className="help is-danger">{errors.lastName}</p>
        ) : null}
      </div>

      <div className="field">
        <label className="label" htmlFor="email">Email Address</label>
        <div className="control">
          <input
            className={`input ${errors.email ? 'is-danger' : ''}`}
            id="email"
            name="email"
            type="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
        </div>
        {touched.email && errors.email ? (
          <p className="help is-danger">{errors.email}</p>
        ) : null}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-primary">Submit</button>
        </div>
        <div className="control">
          <button type="button" className="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  );
};

const FormContext = React.createContext();

const useFormField = ({ name }) => {
  const {
    values, errors, touched,
    handleChange, handleBlur,
  } = useContext(FormContext);

  return [{
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
  },
  {
    error: errors[name],
    touched: touched[name],
  },
  ];
};

const MyTextInputSimple = React.memo(({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useFormField(props);
  return (
    <div className="field">
      <label className="label" htmlFor={props.id || props.name}>{label}</label>
      <div className="control">
        <input
          className={`input ${meta.error ? 'is-danger' : ''}`}
          type="text"
          {...field}
          {...props}
        />
      </div>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
});

const MyCheckboxSimple = React.memo(({ children, ...props }) => {
  // React treats radios and checkbox inputs differently other input types, select, and textarea.
  // Formik does this too! When you specify `type` to useField(), it will
  // return the correct bag of props for you -- a `checked` prop will be included
  // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
  const [field, meta] = useFormField({ ...props, type: 'checkbox' });
  return (
    <div className="field">
      <div className="control">
        <label className="checkbox">
          <input type="checkbox" {...field} {...props} />
          {children}
        </label>
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    </div>
  );
});

const MySelectSimple = React.memo(({ label, children, ...props }) => {
  const [field, meta] = useFormField(props);
  return (
    <div className="field">
      <label className="label" htmlFor={props.id || props.name}>{label}</label>
      <div className="control">
        <div className="select">
          <select {...field} {...props}>{children}</select>
          {meta.touched && meta.error ? (
            <div className="error">{meta.error}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

const SignupForm2Simple = () => {
  const {
    values, errors, touched, handleChange, handleBlur,
  } = useForm(signup2InitialValues);

  const handleSubmit = useCallback(() => {
    alert(JSON.stringify(values, null, 2));
  }, [values]);

  const value = useMemo(() => ({
    values, errors, touched, schema: signup2Schema, handleChange, handleBlur,
  }), [errors, handleBlur, handleChange, touched, values]);

  console.log('SignupForm2Simple');
  return (
    <FormContext.Provider value={value}>
      <form className="box" onSubmit={handleSubmit}>
        <h1>Signup Form Simple 2</h1>
        <MyTextInputSimple
          label="First Name"
          name="firstName"
          type="text"
          placeholder="Jane"
        />

        <MyTextInputSimple
          label="Last Name"
          name="lastName"
          type="text"
          placeholder="Doe"
        />

        <MyTextInputSimple
          label="Email Address"
          name="email"
          type="email"
          placeholder="jane@formik.com"
        />

        <MySelectSimple label="Job Type" name="jobType">
          <option value="">Select a job type</option>
          <option value="designer">Designer</option>
          <option value="development">Developer</option>
          <option value="product">Product Manager</option>
          <option value="other">Other</option>
        </MySelectSimple>

        <MyCheckboxSimple name="acceptedTerms">
          I accept the terms and conditions
        </MyCheckboxSimple>

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-primary">Submit</button>
          </div>
          <div className="control">
            <button type="button" className="button is-link is-light">Cancel</button>
          </div>
        </div>
      </form>
    </FormContext.Provider>
  );
};

const Forms = () => (
  <div className="content">
    <h1 className="subtitle is-1">Form Handling</h1>
    <hr />
    <p>
      Objetivo aqui é testar diferentes formas de tratamento de formulários em react,
      para iniciar testaremos a lib <a href="https://formik.org/">Formik</a> usando o hook useFormk.<br />
      Neste teste achei bem prático o uso do hook, porem o html se torna bem extenso e repetitivo.
    </p>
    <Code>
      {`const SignupForm = () => {
        const formik = useFormik({
          initialValues: signupInitialValues,
          validationSchema: signupSchema,
          onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
          },
        });
        return (
          <form className="box" onSubmit={formik.handleSubmit}>
            <h1 className="subtitle is-5">Signup Form</h1>
            <div className="field">
              <label className="label" htmlFor="firstName">First Name</label>
              <div className="control">
                <input
                  className="input"
                  id="firstName"
                  name="firstName"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                />
              </div>
              {formik.touched.firstName && formik.errors.firstName ? (
                <p className="help is-danger">{formik.errors.firstName}</p>
              ) : null}
            </div>
            {/* Resto do html do formulário  */}
      
            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-primary">Submit</button>
              </div>
              <div className="control">
                <button type="button" className="button is-link is-light">Cancel</button>
              </div>
            </div>
          </form>
        );
      };`}
    </Code>
    <SignupForm />
    <p>
      Para nosso segundo teste eu usei o Formik element no JSX e abstrai o html dos campos em
      componentes menores usando o hook useField, essa abordagem garante muito mais reus de código
      e pouca repetição no JSX.
    </p>
    <p>
      <strong>OBS.</strong> dentro do element Formik podemos usar o <i>form</i> porem teremos que
      passar manualmente os eventos de onSubmit e onReset, enquanto o elemento <i>Form</i>
      abstrai essa necessidade reduzindo a quantidade de código escrito.
    </p>
    <Code>
      {`const MyTextInput = React.memo(({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="field">
      <label className="label" htmlFor={props.id || props.name}>{label}</label>
      <div className="control">
        <input
          className='input'
          type="text"
          {...field}
          {...props}
        />
      </div>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
});
const SignupForm = () => {
  const handleSubmit = useCallback((values) => {
    alert(JSON.stringify(values, null, 2));
  }, []);

  return (
    <Formik
      initialValues={signup2InitialValues}
      validationSchema={signup2Schema}
      onSubmit={handleSubmit}
    >
      <Form className="box">
        <h1 className="subtitle is-5">Signup Form</h1>
        <MyTextInput
          label="First Name"
          name="firstName"
          type="text"
          placeholder="Jane"
        />

        <MyTextInput
          label="Last Name"
          name="lastName"
          type="text"
          placeholder="Doe"
        />

        {/* Resto do html do formulário  */}

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-primary">Submit</button>
          </div>
          <div className="control">
            <button type="button" className="button is-link is-light">Cancel</button>
          </div>
        </div>
      </Form>
    </Formik>
  );
};`}
    </Code>
    <SignupForm2 />
    <p>
      Com os testes anteriores conclui que o Formik de fato é uma lib bem completa que permite
      formas variadas de uso, porem para nosso teceiro teste vamos tentar replicar de forma minima
      o funciomaneto dos testes anteriores sem o uso da lib do Formik. Esta será uma forma incrivel
      de entender melhor o funcionamento dela ou até mesmo replicar sua facilidade em projetos
      menores que não queiram importar a lib completa para dentro das dependencias.
    </p>
    <p>
      Para replicar o nosso primeiro experimento eu precisei criar um hook similar ao useFormik,
      tarefa que se mostrou mais simples do que eu esperava e com poucas linhas consegui
      fazê-lo funcionar.
    </p>
    <Code>
      {`const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    // eslint-disable-next-line no-shadow
    setValues((values) => ({ ...values, [e.target.name]: e.target.value }));
  }, []);

  const handleBlur = useCallback((e) => {
    // eslint-disable-next-line no-shadow
    setTouched((touched) => ({ ...touched, [e.target.name]: true }));
  }, []);

  useEffect(() => {
    const validation = () => {
      signupSchema.validate(values, { abortEarly: false })
        .catch((yupValidation) => setErrors(getYupErrors(yupValidation)));
    };
    validation();
  }, [values]);

  return {
    handleChange, handleBlur, values, errors, touched,
  };
};`}
    </Code>
    <SignupFormSimple />
    <p>
      Para replicar o nosso segundo teste foi necessário criar um hook similar ao useField,
      o que tambem consegui fazer com poucas linhas.
    </p>
    <Code>
      {`const FormContext = React.createContext();

const useFormField = ({ name }) => {
  const {
    values, errors, touched,
    handleChange, handleBlur,
  } = useContext(FormContext);

  return [{
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
  },
  {
    error: errors[name],
    touched: touched[name],
  },
  ];
};`}
    </Code>
    <SignupForm2Simple />
    <p>
      Apesar do sucesso deste experimento, aqui implementamos apenas uma parte pequena de um lib
      bem completa e testada e com certeza o recomendado seria usar o Formik e não recriar sua
      própria lib, para finalizar temos mais alguns testes de uso do Formik e todo seu poder.
    </p>
    <InviteFriends />
    <LinkedForm />
  </div>
);

Forms.propTypes = {};

Forms.defaultProps = {};

export default Forms;
