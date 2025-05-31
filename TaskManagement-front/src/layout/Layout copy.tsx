import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import {
  QuestionCircleOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  IdcardOutlined,
  BookTwoTone,
  CheckSquareOutlined,
  FileDoneOutlined
} from '@ant-design/icons'
import { Button, Layout, Menu, theme, Breadcrumb } from 'antd'
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
  //getItem(<Link to="/users"> Usuarios </Link>, '2', <UserOutlined />),
  getItem(<Link to="/users">Personal</Link>, '2', <UserOutlined />, [
    getItem(<Link to="/users">Usuarios</Link>, '2-1', <UserOutlined />),  
    getItem(<Link to="/users/role">Roles</Link>, '2-2', <IdcardOutlined />)]),
  getItem(<Link to="/teams"> Equipos </Link>, '3', <TeamOutlined />),
  getItem(<Link to="/tasks"> Tareas </Link>, '4', <BookOutlined />),
  getItem(<Link to="/about"> About </Link>, '7', <QuestionCircleOutlined />),
]

const App: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
    const handleLogout = () => {
      logout();
      navigate('/login');
    };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh', height: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
        <FileDoneOutlined style={{ fontSize: 32, color: '#fff', marginRight: 24 }} />
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
          flex: 1, // Hace que el contenido crezca
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <Breadcrumb
          style={{ margin: '16px 0' }}        
        />
        <div
          style={{
            width: '100%',
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
      <Footer style={{ textAlign: 'center' }}>
         Task-Management ©{new Date().getFullYear()}  Created by MDL  
      </Footer>
    </Layout>
  );
};

export default App;