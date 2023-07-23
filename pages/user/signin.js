import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import BaseLayout from 'components/BaseLayout';

export default function SignIn() {
  const [formProcessing, setFormProcessing] = useState(false);
  const [error, setError] = useState(false);
  const loginForm = useRef();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formProcessing) return;

    setError(null);
    setFormProcessing(true);

    const form = new FormData(loginForm.current);
    const { ok } = await signIn('credentials', {
      redirect: false,
      email: form.get('email'),
      password: form.get('password')
    });

    if (ok) {
      router.push('/');
    } else {
      setError('Not authorized. Try again');
    }
    setFormProcessing(false);
  };

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Sign in
            </h1>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <form className="flex flex-wrap -m-2" ref={loginForm} onSubmit={handleSubmit}>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="email" className="leading-7 text-sm text-gray-600">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="password" className="leading-7 text-sm text-gray-600">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  disabled={formProcessing}
                  className="disabled:opacity-50 flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 my-4 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                  {formProcessing ? 'Please wait...' : 'Login'}
                </button>
                {error && (
                  <div className="flex justify-center w-full my-5">
                    <span className="w-full text-red-600">Account not created: {error}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
