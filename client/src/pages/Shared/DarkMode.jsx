import React from 'react';
import { Button } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';

const DarkMode = ({ isDarkMode, toggleTheme }) => {
  return (
    <Button
      type="link"
      icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleTheme}
      style={{
        position: 'absolute',
        top: '50%',
        right: '20px',
        transform: 'translateY(-50%)', // Center the button vertically
        padding: 0, // Remove padding to make the button icon-only
        border: 'none', // Remove border for clean appearance
        background: 'transparent', // Make background transparent
      }}
    />
  );
};

export default DarkMode;
