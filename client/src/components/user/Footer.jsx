import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons'; // Import the Home icon
import '../../styles/Footer.css'
const { Text } = Typography;

const Footer = () => {
  return (
    <Layout.Footer style={{ background: '#001529', color: 'white', padding: '20px 50px' }}>
      <Row justify="space-between" gutter={16}>
        <Col xs={24} sm={8}>
          <Space direction="horizontal" size={16}>
            {/* Home button replaced with Home icon */}
            <Link to="/" style={{ color: 'white' }}>
              <HomeOutlined style={{ fontSize: '20px' }} />
            </Link>
            <a href="/movies" style={{ color: 'white' }}>Movies</a>
          </Space>
        </Col>

        <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ color: 'white', display: 'inline-block' }}>
            MovieTicketApp ©{new Date().getFullYear()} | All Rights Reserved
          </Text>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: '10px' }}>
        <Link to="/owner/login" style={{ color: 'white' }}>Owner Login</Link>
      </Row>
      <Row justify="center" style={{ marginTop: '10px' }}>
        <Link to="/admin/login" style={{ color: 'white' }}>Admin Login</Link>
      </Row>
    </Layout.Footer>
  );
};

export default Footer;
