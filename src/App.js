// App.js
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddItem from './pages/AddItem';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Updated items state with new data, including expiryDate and expiryTime
  const [items, setItems] = useState([
    {
      id: 1,
      image:
        'https://artwork.espncdn.com/events/401352195/16x9/large_20210815233919.jpg',
      title: 'Hawks vs. Knicks Over/Under',
      date: 'October 15, 2025',
      time: '12:00 PM',
      expiryDate: 'October 20, 2025',
      expiryTime: '7:30 PM ET',
      text: 'Over/Under: 215.5 points scored',
      options: ['Over', 'Under'],
    },
    {
      id: 2,
      image:
        'https://i.ytimg.com/vi/MDb1MqwhB38/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBIH0K5gMj6ZYImtbXeLtJ-TdOv7g',
      title: 'Kirk Cousins TD Passes',
      date: 'October 16, 2025',
      time: '3:00 PM',
      expiryDate: 'October 21, 2025',
      expiryTime: '8:00 PM ET',
      text: 'Kirk Cousins over 3.5 Touchdown Passes',
      options: ['Over', 'Under'],
    },
    {
      id: 3,
      image:
        'https://www.cookwithnabeela.com/wp-content/uploads/2024/02/ChickenNuggets.webp',
      title: '100 Chicken Nuggets Challenge',
      date: 'October 17, 2025',
      time: '6:00 PM',
      expiryDate: 'October 22, 2025',
      expiryTime: '6:00 PM ET',
      text: 'Do you think I can eat 100 chicken nuggets in 10 minutes?',
      options: ['Yes', 'No'],
    },
  ]);

  // Handle logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App font-sans">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={'/assets/logo.png'} alt="Bet Buddy Logo" className="h-8 w-8 mr-2 rounded-full" />
            <span className="text-2xl font-bold">Bet Buddy</span>
          </Link>
          <nav>
            {isLoggedIn ? (
              <>
                <Link
                  to="/add-item"
                  className="ml-4 text-white hover:text-gray-300"
                >
                  Add Item
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 text-white hover:text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="ml-4 text-white hover:text-gray-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="ml-4 text-white hover:text-gray-300"
                >
                  Signup
                </Link>
              </>
            )}
          </nav>
        </header>
        <div className="container mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={<Home isLoggedIn={isLoggedIn} items={items} />}
            />
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/signup"
              element={<Signup setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/add-item"
              element={
                isLoggedIn ? (
                  <AddItem items={items} setItems={setItems} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
