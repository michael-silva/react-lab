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
  console.log('SignupForm');
  return (
    <form onSubmit={formik.handleSubmit}>
      <h1>Signup Form</h1>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.firstName}
      />
      {formik.touched.firstName && formik.errors.firstName ? (
        <div>{formik.errors.firstName}</div>
      ) : null}

      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.lastName}
      />
      {formik.touched.lastName && formik.errors.lastName ? (
        <div>{formik.errors.lastName}</div>
      ) : null}

      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}

      <button type="submit">Submit</button>
    </form>
  );
};

const MyTextInput = React.memo(({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
});

const MyCheckbox = React.memo(({ children, ...props }) => {
  // React treats radios and checkbox inputs differently other input types, select, and textarea.
  // Formik does this too! When you specify `type` to useField(), it will
  // return the correct bag of props for you -- a `checked` prop will be included
  // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  return (
    <div>
      <label className="checkbox-input">
        <input type="checkbox" {...field} {...props} />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
});

const MySelect = React.memo(({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
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
  console.log('SignupForm2');
  return (
    <Formik
      initialValues={signup2InitialValues}
      validationSchema={signup2Schema}
      onSubmit={handleSubmit}
    >
      <Form>
        <h1>Signup Form 2</h1>
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

        <button type="submit">Submit</button>
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
  <div>
    <h1>Invite friends</h1>
    <Formik
      initialValues={friendsInitialValues}
      onSubmit={async (values) => {
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((r) => setTimeout(r, 500));
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ values }) => (
        <Form>
          <FieldArray name="friends">
            {({ insert, remove, push }) => (
              <div>
                {values.friends.length > 0
                  && values.friends.map((friend, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div className="row" key={index}>
                      <div className="col">
                        <MyTextInput
                          label="Name"
                          name={`friends.${index}.name`}
                          type="text"
                          placeholder="Jane Doe"
                        />

                      </div>
                      <div className="col">
                        <MyTextInput
                          label="Email"
                          name={`friends.${index}.email`}
                          type="email"
                          placeholder="jane@formik.com"
                        />
                      </div>
                      <div className="col">
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => remove(index)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                <button
                  type="button"
                  className="secondary"
                  onClick={() => push({ name: '', email: '' })}
                >
                  Add Friend
                </button>
              </div>
            )}
          </FieldArray>
          <button type="submit">Invite</button>
        </Form>
      )}
    </Formik>
  </div>
);

async function fetchNewTextC(a, b) {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((r) => setTimeout(r, 500));
  return `textA: ${a}, textB: ${b}`;
}

const ResultField = (props) => {
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
    <>
      <input key="input" disabled {...props} {...field} />
      {Boolean(meta.touched && meta.error) ?? <div>{meta.error.toString()}</div>}
    </>
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
      <Form>
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

        <button type="submit">Submit</button>
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
    <form onSubmit={handleSubmit}>
      <h1>Signup Form Simple</h1>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.firstName}
      />
      {touched.firstName && errors.firstName ? (
        <div>{errors.firstName}</div>
      ) : null}

      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.lastName}
      />
      {touched.lastName && errors.lastName ? (
        <div>{errors.lastName}</div>
      ) : null}

      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
      />
      {touched.email && errors.email ? (
        <div>{errors.email}</div>
      ) : null}

      <button type="submit">Submit</button>
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
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
});

const MyCheckboxSimple = React.memo(({ children, ...props }) => {
  // React treats radios and checkbox inputs differently other input types, select, and textarea.
  // Formik does this too! When you specify `type` to useField(), it will
  // return the correct bag of props for you -- a `checked` prop will be included
  // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
  const [field, meta] = useFormField({ ...props, type: 'checkbox' });
  return (
    <div>
      <label className="checkbox-input">
        <input type="checkbox" {...field} {...props} />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
});

const MySelectSimple = React.memo(({ label, ...props }) => {
  const [field, meta] = useFormField(props);
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
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
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Submit</button>
      </form>
    </FormContext.Provider>
  );
};
const Reservation = () => {
  const [formData, setFormData] = useState({
    isGoing: true,
    numberOfGuests: 2,
  });

  const handleInputChange = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  return (
    <form>
      <label>
        Estão indo:
        <input
          name="isGoing"
          type="checkbox"
          checked={formData.isGoing}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Número de convidados:
        <input
          name="numberOfGuests"
          type="number"
          value={formData.numberOfGuests}
          onChange={handleInputChange}
        />
      </label>
    </form>
  );
};

const Forms = () => (
  <div className="root" data-testid="Forms">
    Forms Component
    <SignupForm />
    <SignupForm2 />
    <InviteFriends />
    <LinkedForm />
    <SignupFormSimple />
    <SignupForm2Simple />
    <Reservation />
  </div>
);

Forms.propTypes = {};

Forms.defaultProps = {};

export default Forms;
