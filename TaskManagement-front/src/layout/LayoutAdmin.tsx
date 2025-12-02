import { useMemo } from 'react'
import { Outlet, Link } from 'react-router-dom'
import {
  QuestionCircleOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  IdcardOutlined,
  FileDoneOutlined
} from '@ant-design/icons'
import { Button, Layout, Menu, theme, Breadcrumb } from 'antd'
import { useNavigate } from 'react-router-dom';
const { Header, Content, Footer } = Layout
import { useAuth } from '../contexts/authContext.tsx';

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
  children?: MenuItem[];
  label: React.ReactNode;
  roles?: Rol[]; 
}

type Rol = 'ADMIN' | 'MANAGER' | 'ALL_USER' | 'LIDER';

//Defino los items del menu y los roles que pueden ver cada uno
const generateMenuItems = () => [
  getItem(<Link to="/"> Home </Link>, '1', <HomeOutlined />, null, ['ALL_USER']), 
  
  // Ítem principal que requiere rol admin
  getItem(<Link to="/users">Personal</Link>, '2', <UserOutlined />, [
    // Sub-items
    getItem(<Link to="/users">Usuarios</Link>, '2-1', <UserOutlined />, null, ['ADMIN','LIDER', 'MANAGER']), 
    getItem(<Link to="/users/role">Roles</Link>, '2-2', <IdcardOutlined />, null, ['ADMIN','LIDER', 'MANAGER']),
    getItem(<Link to="/users/p">Password</Link>, '2-3', <IdcardOutlined />, null, ['ALL_USER']),
    
  ], ['ALL_USER']),
  getItem(<Link to="/teams"> Equipos </Link>, '3', <TeamOutlined />, null, ['ADMIN', 'MANAGER','LIDER']),
  getItem(<Link to="/tasks"> Tareas </Link>, '4', <BookOutlined />, null, ['ALL_USER']),
  getItem(<Link to="/about"> About </Link>, '7', <QuestionCircleOutlined />, null, ['ALL_USER']), 
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user} = useAuth(); //acceso al usuario logueado
  const currentRole = user?.role.name.toUpperCase() || 'ALL_USER';
  
    const handleLogout = () => {
      logout();
      navigate('/login');
    };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const filteredItems = useMemo(() => { //para calcular la lista de ítems filtrados solo cuando el currentRole cambia
    const allItems = generateMenuItems();

    const filterMenu = (menuItems: MenuItem[]): MenuItem[] => { //para filtrar los items del menú según el rol actual
      return menuItems
        .map(item => {
          // Si el ítem no tiene roles o el rol actual está incluido, lo mantiene
          const isItemAllowed = !item.roles || item.roles.includes(currentRole as Rol);
  
          if (!isItemAllowed && !item.roles?.includes('ALL_USER')) {
            return null; // El ítem principal no está permitido
          }

          // Si el ítem tiene sub-ítems, los filtra recursivamente
          if (item.children) {
            const filteredChildren = filterMenu(item.children);
            // Si el ítem principal está permitido pero no tiene hijos visibles, no lo mostramos (opcional)
            if (filteredChildren.length === 0 && !item.label) { 
                return null;
            }
            return { ...item, children: filteredChildren };
          }

          return item; 
        })
        .filter(item => item !== null); // Eliminar ítems nulos/no permitidos
    };

    return filterMenu(allItems);
  }, [currentRole]);

  return (
    <Layout style={{ minHeight: '100vh', height: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={filteredItems}
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