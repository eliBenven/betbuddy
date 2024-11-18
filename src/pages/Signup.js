// Signup.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = ({ setIsLoggedIn }) => {
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // onChange handler to update state as the user types
  const handleChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  // onSubmit handler to prevent default behavior and simulate signup
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup Data:', signupData);
    // Simulate successful signup and login
    setIsLoggedIn(true);
    // Clear input fields after submission
    setSignupData({
      username: '',
      email: '',
      password: '',
    });
    // Redirect to Home page
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Username:</label>
          <input
            type="text"
            name="username"
            value={signupData.username}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={signupData.email}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Password:</label>
          <input
            type="password"
            name="password"
            value={signupData.password}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Signup
        </button>
      </form>
      <p className="mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
