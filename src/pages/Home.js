// Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ isLoggedIn, items }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome to Bet Buddy</h2>
      {!isLoggedIn && (
        <div className="mb-4">
          <p>
            Please{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>{' '}
            or{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Signup
            </Link>{' '}
            to start placing your bets.
          </p>
        </div>
      )}
      {isLoggedIn ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition relative"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-1">
                <strong>Posted on:</strong> {item.date} at {item.time}
              </p>
              <p className="mb-2">{item.text}</p>
              <div className="flex space-x-2 mb-8">
                {item.options.map((option, index) => (
                  <button
                    key={index}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="absolute bottom-2 right-2 text-gray-500 text-sm">
                Expires on {item.expiryDate} at {item.expiryTime}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center">
          <p className="text-gray-600">Please log in to see available bets.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
