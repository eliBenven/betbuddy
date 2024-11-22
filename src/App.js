import React, { useState, useEffect } from 'react';
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
import Friends from './pages/Friends';
import OpenBets from './pages/OpenBets';
import BetHistory from './pages/BetHistory';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Check for user role in localStorage
    const role = localStorage.getItem('role');
    setUserRole(role || ''); // Default to empty string if no role is found
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole('');
  };

  const [items, setItems] = useState([]);

  return (
    <Router>
      <div className="font-sans App">
        <header className="flex items-center justify-between p-4 text-white bg-gray-800">
          <Link to="/" className="flex items-center">
            <img src={'/assets/logo.png'} alt="Bet Buddy Logo" className="w-8 h-8 mr-2 rounded-full" />
            <span className="text-2xl font-bold">Bet Buddy</span>
          </Link>
          <nav>
            {isLoggedIn ? (
              <>
                <Link
                  to="/friends"
                  className="ml-4 text-white hover:text-gray-300"
                >
                  Friends
                </Link>
                <Link
                  to="/open-bets"
                  className="ml-4 text-white hover:text-gray-300"
                >
                  Open Bets
                </Link>
                <Link
                  to="/bet-history"
                  className="ml-4 text-white hover:text-gray-300"
                >
                  Bet History
                </Link>
                <Link
                  to="/add-item"
                  className="ml-4 text-white hover:text-gray-300"
                >
                  New Post
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
        <div className="container p-4 mx-auto">
          <Routes>
            <Route
              path="/"
              element={<Home isLoggedIn={isLoggedIn} />}
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
              element={isLoggedIn ? <AddItem items={items} setItems={setItems} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/friends"
              element={isLoggedIn ? <Friends /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/open-bets"
              element={isLoggedIn ? <OpenBets /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/bet-history"
              element={isLoggedIn ? <BetHistory /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
