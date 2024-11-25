import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddItem from './pages/AddItem';
import MyBets from './pages/MyBets'; // Updated name
import AdminManagement from './pages/AdminManagement'; // Import admin page
import axios from 'axios';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user'); // Track role
  const [items, setItems] = useState([]); // Initialize items here

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
      } else {
        try {
          const response = await axios.get('http://localhost:5001/auth/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsLoggedIn(true);
          setUserRole(response.data.role);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <Router>
      <div>
        <header className="flex items-center justify-between px-4 py-2 text-white bg-gray-900">
          <div className="flex justify-normal">
          <img src="assets/logo.png" alt="BetBuddy Logo" className="mx-4" width={40} height={40} />
            <Link to="/" className="my-auto text-xl font-bold">BetBuddy</Link>
          </div>
          
          <nav>
            {isLoggedIn ? (
              <>
                <Link to="/" className="ml-4">Home</Link>
                <Link to="/add-item" className="ml-4">New Bet</Link>
                <Link to="/my-bets" className="ml-4">My Bets</Link>
                {userRole === 'admin' && <Link to="/admin" className="ml-4">Admin</Link>}
                <button onClick={handleLogout} className="ml-4">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="ml-4">Login</Link>
                <Link to="/signup" className="ml-4">Signup</Link>
              </>
            )}
          </nav>
        </header>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
            <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
            <Route
              path="/add-item"
              element={isLoggedIn ? <AddItem items={items} setItems={setItems} /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-bets"
              element={isLoggedIn ? <MyBets /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={isLoggedIn && userRole === 'admin' ? <AdminManagement /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;

