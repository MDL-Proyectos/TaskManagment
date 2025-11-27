import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import {
  QuestionCircleOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  IdcardOutlined
} from '@ant-design/icons'
import { Button, Layout, Menu, theme } from 'antd'
import { useNavigate } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout
import { useAuth } from '../contexts/authContext.tsx';

function getItem(label: any, key: any, icon:any, children?: any) {
  return {
    key,
    icon,
    children,
    label,
  }
}


const items = [
  getItem(<Link to="/"> Home </Link>, '1', <HomeOutlined />),
  getItem(<Link to="/tasks"> Tareas </Link>, '4', <BookOutlined />),
  getItem(<Link to="/about"> About </Link>, '7', <QuestionCircleOutlined />),
]

const App = () => {
   
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const {
    token: { colorBgContainer },
  } = theme.useToken()
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
        ></Menu>
      </Sider>
      <Layout style={{ width: '100%' }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h2>Task-Management</h2>
          <Button
            type="primary"
            danger
            style={{ marginRight: 24 }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Header>
        <Content
          style={{
            margin: '20px 16px',
          }}
        >
          <div
            style={{
              height: '100%',
              background: colorBgContainer,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Outlet />
          </div>
        </Content>
        
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Task-Management ©2024 Created by MDL
        </Footer>
      </Layout>
    </Layout>
  )
}
export default App