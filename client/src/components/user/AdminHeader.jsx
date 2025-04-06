import React from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import { Link } from 'react-router-dom'; 
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'; 
import '../../styles/userHeader.css'

const { Header: AntLayoutHeader } = Layout;

const AdminHeader = () => {
  return (
    <AntLayoutHeader style={{ background: '#001529', padding: '0 20px' }}>
      {/* Logo Section */}
      <div className="logo" style={{ flex: 1 }}>
        <Link to="/">
          <h2 style={{ color: 'white', margin: 0 }}>MovieTicketApp</h2>
        </Link>
      </div>

      {/* Menu Section */}
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ flex: 3, display: 'flex', justifyContent: 'flex-end', padding: 0 }}
        defaultSelectedKeys={['1']}
      >
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/movies">Movies</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/search">Search</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/addmovies">Add Movies</Link>
        </Menu.Item>
        {/* Profile icon and logout button */}
        <Menu.Item key="5" style={{ padding: '0 10px' }}>
          <Link to="/profile">
            {/* Avatar with user icon */}
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
          </Link>
        </Menu.Item>
        <Menu.Item key="5" style={{ padding: '0 10px' }}>
                  {/* Wrap the Logout button in a Link */}
                  <Link to="/logout">
                    <Button type="link" style={{ color: 'white' }}>
                      <LogoutOutlined />
                      Logout
                    </Button>
                  </Link>
                </Menu.Item>
      </Menu>
    </AntLayoutHeader>
  );
};

export default AdminHeader;
