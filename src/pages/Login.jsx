import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error('Failed to register');
      }
      const data = await response.json();
      console.log("data",data)

      await login(data.token);
      navigate('/');
    } catch (error) {
      toast.error('Failed to login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center">Sign in to your account</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
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
              <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                Sign in
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-dark">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
