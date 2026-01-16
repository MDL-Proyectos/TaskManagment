import React, { useEffect, useState } from 'react';
import { Layout, Menu, theme, Spin, Empty, Button } from 'antd';
import { FolderOutlined, ProfileOutlined } from '@ant-design/icons';
import ProjectServices from '../routes/ProjectServices';
import { TaskProjectData } from '../entities/TaskProject';
import Tasks from './Tasks'; // Importamos tu componente de tareas
import useAuth from '../hooks/useAuth';
import ProjectTaskModal from '../components/forms/ProjectTaskModal';

const { Sider, Content } = Layout;

function ProjectManagementPage() {
  const [projects, setProjects] = useState<TaskProjectData[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
    const [data, setData] = useState<TaskProjectData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<TaskProjectData | null>(null);
  const {user} = useAuth(); 

  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  
  const fetchProject = async () => {
      try {
        const data = await ProjectServices.getAllProjects();
        setProjects(data);
        if (data.length > 0) setSelectedProjectId(data[0]._id); // Selecciona el primero por defecto
      } catch (error) {
        console.error("Error cargando proyectos", error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchProject();
  }, []);
  
  const handleCreate = () => {
    setEditingProject(null);
    setModalVisible(true);
  };

  // Mapeamos los proyectos a items del menú de AntD
  const menuItems = projects.map(p => ({
    key: p._id,
    icon: <FolderOutlined />,
    label: p.name.toUpperCase(),
  }));

  if (loading) return <Spin size="large" style={{ marginTop: 50 }} />;
//<div style={{ padding: '0 16px 16px', fontWeight: 'bold' }}>Proyectos</div>
  return (
    <Layout style={{ padding: '24px 0', background: colorBgContainer, width: '100%', height: '100%' }}>
      <Sider width={250} style={{ background: colorBgContainer }}>
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
        {modalVisible && (
        <ProjectTaskModal
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          onSaveSuccess={() =>{ 
            setModalVisible(false);
          fetchProject();
        }}
          initialTaskId={editingProject?._id || null}
        />
      )}
      </Content>
    </Layout>
  );
};

export default ProjectManagementPage;