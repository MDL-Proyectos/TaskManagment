import { useEffect, useState } from 'react';
import { Layout, Menu, theme, Empty, Skeleton } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import ProjectServices from '../services/ProjectServices';
import { TaskProjectData } from '../entities/TaskProject';
import Tasks from './Tasks'; 
import userService from '../services/UserServices';
import { useAuth } from '../contexts/authContext.tsx';
import RoleServices from '../services/RoleServices.tsx';

const { Sider, Content } = Layout;

function ProjectManagementPage() {
  const [projects, setProjects] = useState<TaskProjectData[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const { token: { colorBgContainer } } = theme.useToken();
  
  const fetchProject = async () => {
      try {
        const data = await ProjectServices.getAllProjects();
        const userLogged = await userService.getUserById(user?._id  || '');
        const userRoleAdmin = await RoleServices.getRoleByName(userLogged.role.name);

        //Acá filtro los proyectos según rol del usuario.
        //Solo tienen acceso los usuarios líderes o admin a este componente.
        if (userLogged && userLogged.is_leader && userRoleAdmin.is_admin) {
         // console.log('Usuario es líder pero no admin, mostrando solo proyectos del equipo');
          const dataLeader = data.filter((project) => project.assigned_team?._id === userLogged.team?._id);
          setProjects(dataLeader);
          if (dataLeader.length > 0) setSelectedProjectId(dataLeader[0]._id); // Selecciona el primero por defecto
        } else {
         // console.log('Usuario es admin, mostrando todos los proyectos');
          setProjects(data);
          if (data.length > 0) setSelectedProjectId(data[0]._id); // Selecciona el primero por defecto
        }

      } catch (error) {
        console.error("Error cargando proyectos", error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchProject();
  }, []);


  const menuItems = projects.map(p => ({
    key: p._id,
    icon: <FolderOutlined />,
    label: p.name.toUpperCase(),
  }));

  if (loading) return <Skeleton style={{ marginTop: 50 }} />;
  return (
    <Layout style={{ padding: '24px 0', background: colorBgContainer, width: '100%', 
      height: 'calc(100vh - 64px)', // Ajusta según el alto del header
      overflow: 'hidden' // Evita que el layout principal haga scroll
     }}>
      <Sider 
        width={250} 
        style={{ 
          background: colorBgContainer,
          overflowY: 'auto', // Habilita el scroll interno en el Sider
          height: '100%',
          scrollbarColor: '#888 transparent', 
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={selectedProjectId ? [selectedProjectId] : []}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
          onClick={(e) => setSelectedProjectId(e.key)}
        />
      </Sider>
      <Content style={{ padding: '0 24px', minHeight: 280 }}>
        {selectedProjectId ? (
          <Tasks projectId={selectedProjectId} />
          
        ) : (
          <Empty description="Selecciona un proyecto para ver sus tareas" />
        )},

      </Content>
    </Layout>
  );
};

export default ProjectManagementPage;