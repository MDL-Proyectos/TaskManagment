import { useMemo } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  QuestionCircleOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  IdcardOutlined,
  FileDoneOutlined,
  ProfileOutlined
} from '@ant-design/icons'
import { Button, Layout, Menu, theme, Breadcrumb, Tag } from 'antd'
import { useNavigate } from 'react-router-dom';
const { Header, Content, Footer } = Layout
import { useAuth } from '../../contexts/authContext.tsx';
import { ItemType } from 'antd/es/menu/interface';

function getItem(label: any, key: any, icon: any, children?: any, roles?: Rol[]) {
  return {
    key,
    icon,
    children,
    label,
    roles, //Filtro los items por rol de usuario.
  };
}

export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  children?: ItemType<MenuItem>[]; // Mantener el tipo esperado
  label: React.ReactNode;
  roles?: Rol[];
  [dataKey: `data-${string}`]: any; // Agregar firma de índice para propiedades dinámicas
}

type Rol = 'ADMIN' | 'ALL_USER';

//Defino los items del menu y los roles que pueden ver cada uno
const generateMenuItems = () => [
  getItem(<Link to="/"> Home </Link>, '1', <HomeOutlined />, null, ['ALL_USER']), 
  
  // Ítem principal que requiere rol admin
  getItem(<Link to="/users">Personal</Link>, '2', <UserOutlined />, [
    // Sub-items
    getItem(<Link to="/users">Usuarios</Link>, '2-1', <UserOutlined />, null, ['ADMIN','ALL_USER']), 
    getItem(<Link to="/users/role">Roles</Link>, '2-2', <IdcardOutlined />, null, ['ADMIN']),
    getItem(<Link to="/users/p">Password</Link>, '2-3', <IdcardOutlined />, null, ['ALL_USER']),    
  ], ['ALL_USER']),
  getItem(<Link to="/teams"> Equipos </Link>, '3', <TeamOutlined />, null, ['ADMIN']),
  getItem(<Link to="/taskProject"> Proyectos </Link>, '6', <BookOutlined />, null, ['ADMIN']),  
  getItem(<Link to="/tasks"> Tareas </Link>, '7', <ProfileOutlined />, null, ['ALL_USER']),
  getItem(<Link to="/about"> About </Link>, '8', <QuestionCircleOutlined />, null, ['ALL_USER']), 
];

function LayoutAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user} = useAuth(); //acceso al usuario logueado
  //const currentRole = user?.role.name.toUpperCase() || 'ALL_USER';
  const currentRole = !user?.role?.is_admin ? 'ADMIN' : 'ALL_USER';
    const handleLogout = () => {
      logout();
      navigate('/login');
    };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const filteredItems = useMemo(() => {
    const allItems = generateMenuItems();


    const filterMenu = (menuItems: MenuItem[]): ItemType<MenuItem>[] => {
      return menuItems
        .map(item => {
          const isItemAllowed = !item.roles || item.roles.includes(currentRole as Rol);

          if (!isItemAllowed && !item.roles?.includes('ALL_USER')) {
            return null;
          }

          if (item.children) {
            const filteredChildren = filterMenu(item.children as MenuItem[]);
            if (filteredChildren.length === 0 && !item.label) {
              return null;
            }
            return { ...item, children: filteredChildren };
          }

          return item;
        })
        .filter((item): item is MenuItem => item !== null);
    };

    return filterMenu(allItems);
  }, [currentRole]);

  const currentItemLabel = useMemo(() => {
    const allItems = generateMenuItems();
    
    for (const item of allItems) {
      // Si es el item principal
      if (item.label.props.to === location.pathname) return item.label.props.children;
      
      // Si tiene hijos, buscamos dentro
      if (item.children) {
        const child = item.children.find((c: any) => c.label.props.to === location.pathname);
        if (child) return (child as any).label.props.children;
      }
    }
    return '...'; // Texto por defecto
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={filteredItems}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Tag color={ 'green'} style={{  marginRight: 100, height: 32, width: 100, alignItems: 'center', justifyContent: 'center', display: 'flex', fontSize: 14 }} >{currentItemLabel} </Tag>
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

export default LayoutAdmin;