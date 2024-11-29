import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("hai")
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error('Failed to register');
      }
      // In a real app, you'd make an API call to register
      const data = await response.json();
      console.log('data',data)

      // await login(values.email, values.password);
      await login(data.token);

      navigate('/');
    } catch (error) {
      toast.error('Failed to register');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center">Create your account</h2>
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '', username: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium">
                  Full Name
                </label>
                <Field
                  id="name"
                  type="text"
                  name="username"
                  required
                  className="input-field"
                />
                <ErrorMessage name="username" component="div" className="text-red-600" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email address
                </label>
                <Field
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="input-field"
                />
                <ErrorMessage name="email" component="div" className="text-red-600" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Field
                  id="password"
                  type="password"
                  name="password"
                  required
                  className="input-field"
                />
                <ErrorMessage name="password" component="div" className="text-red-600" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                  Confirm Password
                </label>
                <Field
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  className="input-field"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-600" />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                Register
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-dark">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
