import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import {
  QuestionCircleOutlined,
  PhoneOutlined,
  HomeOutlined,
  TeamOutlined,
  MailOutlined,
  UserOutlined,
  BookOutlined,
  IdcardOutlined
} from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd'

const { Header, Content, Footer, Sider } = Layout

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
  getItem(<Link to="/users">Usuarios</Link>, '2', <UserOutlined />, [
    getItem(<Link to="/users/role">Roles</Link>, '2-1', <IdcardOutlined />)]),  
  getItem(<Link to="/teams"> Equipos </Link>, '3', <TeamOutlined />),
  getItem(<Link to="/tasks"> Tareas </Link>, '4', <BookOutlined />),
  getItem(<Link to="/about"> About </Link>, '7', <QuestionCircleOutlined />),
]

const App = () => {
  const [collapsed, setCollapsed] = useState(false)
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
          <h1>Task-Managment</h1>
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
          Task-Managment ©2024 Created by MDL
        </Footer>
      </Layout>
    </Layout>
  )
}
export default App