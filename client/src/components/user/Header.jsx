import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import DarkMode from '../../pages/Shared/DarkMode';

// This is destructured from Ant Design
const { Header: AntLayoutHeader } = Layout;

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Declare the isDarkMode state

  useEffect(() => {
    // Check if user is logged in by checking localStorage or a global state
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }

    // Check if dark mode is saved in localStorage
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    document.body.classList.toggle('dark-mode', darkMode); // Apply dark mode class to body
  }, []);

  const handleLogout = () => {
    // Remove user data from localStorage and redirect to login
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  // Toggle the dark mode state and store it in localStorage
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode); // Store the dark mode preference
      document.body.classList.toggle('dark-mode', newMode); // Toggle dark mode on body
      return newMode;
    });
  };

  return (
    <AntLayoutHeader className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Logo */}
      <div className="logo">
        <Link to="/">
          <h3 style={{ color: 'white' }}>MovieTicketApp</h3>
        </Link>
      </div>
      <Menu
        theme={isDarkMode ? 'dark' : 'light'}
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{
          display: 'flex',
          justifyContent: 'flex-end', // Make sure menu items are aligned to the right
          flex: 1, // Ensure the Menu takes full available space
          padding: 0, // Remove padding to make it align exactly
        }}
      >
        <Menu.Item key="2">
          <Link to="/movies">Movies</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/search">
            <SearchOutlined />
            Search
          </Link>
        </Menu.Item>
        {isAuthenticated ? (
          <>
            <Menu.Item key="4">
              <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Button type="link" onClick={handleLogout}>
                Logout
              </Button>
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item key="6">
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link to="/signup">Sign Up</Link>
            </Menu.Item>
          </>
        )}
      </Menu>

      {/* DarkMode toggle outside the Menu but still aligned to the right */}
      <div style={{ marginLeft: 'auto' }}>
        <DarkMode isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>
    </AntLayoutHeader>
  );
};

export default Header;
