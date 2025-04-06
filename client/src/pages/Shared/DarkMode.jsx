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
        transform: 'translateY(-50%)', 
        padding: 0, 
        border: 'none', 
        background: 'transparent', 
      }}
    />
  );
};

export default DarkMode;
