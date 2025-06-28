import React from 'react';
import { Layout, Input, Avatar, Badge, Tooltip, Typography } from 'antd';
import { BellOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import './Header.css';
import HeroSection from '../Menues/Menue';

const { Header, Content } = Layout;
const { Title } = Typography;

const MainHeader: React.FC = () => {
  return (
    <Layout>
      <HeroSection/>
      {/* <Header className="home-header">
        <div className='left-componet'>
          <Title level={3} className="home-title">Hotel Name</Title>
          <Input
            prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Search"
            className="home-search-input"
          />
        </div>
        <div>
          <Tooltip title="Notifications">
            <Badge count={5} dot>
              <BellOutlined style={{ fontSize: '18px', color: '#87d068', marginRight: '20px' }} />
            </Badge>
          </Tooltip>
          <Avatar style={{ backgroundColor: '#87d068', marginRight: '20px' }} icon={<UserOutlined />} />
        </div>
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <div style={{ background: '#fff', minHeight: 280, padding: 24 }}>
          
        </div>
      </Content> */}
    </Layout>
  );
};

export default MainHeader;
