// pages/index.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './_app'; // Import AuthContext from _app.js

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { login, isAuthenticated, isFirstTimeUser } = useContext(AuthContext); // Get isAuthenticated and isFirstTimeUser
  const [message, setMessage] = useState('');

  // Effect to redirect after login/signup
  useEffect(() => {
    if (isAuthenticated) {
      if (isFirstTimeUser) {
        // Use Next.js router for navigation
        window.location.href = '/onboarding';
      } else {
        window.location.href = '/dashboard';
      }
    }
  }, [isAuthenticated, isFirstTimeUser]);


  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    const storedUsers = JSON.parse(localStorage.getItem('brievify_users') || '{}');

    if (isSigningUp) {
      if (storedUsers[email]) {
        setMessage('User already exists. Please log in.');
      } else {
        const newUserId = `user_${Date.now()}`;
        storedUsers[email] = { password, id: newUserId, isFirstTimeUser: true };
        localStorage.setItem('brievify_users', JSON.stringify(storedUsers));
        login(email, newUserId, true);
        // Redirection will happen via useEffect
      }
    } else {
      if (storedUsers[email] && storedUsers[email].password === password) {
        login(email, storedUsers[email].id, storedUsers[email].isFirstTimeUser);
        // Redirection will happen via useEffect
      } else {
        setMessage('Invalid email or password.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {isSigningUp ? 'Sign Up for Brievify' : 'Welcome Back to Brievify'}
        </h2>
        {message && <p className="text-red-400 text-center mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            {isSigningUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          {isSigningUp ? 'Already have an account?' : 'New here?'}
          <button
            onClick={() => setIsSigningUp(!isSigningUp)}
            className="text-blue-400 hover:text-blue-300 ml-1 font-medium"
          >
            {isSigningUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;