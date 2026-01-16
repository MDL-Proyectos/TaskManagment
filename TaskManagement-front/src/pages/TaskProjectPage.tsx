import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProjectTaskModal from '../components/forms/ProjectTaskModal';
import { TaskProjectData } from '../entities/TaskProject';
import ProjectServices from '../routes/ProjectServices';
import useAuth from '../hooks/useAuth';
import ProjectManagementPage from './ProjectTaskManagment';
import { Link, useNavigate } from 'react-router-dom';


function TaskProjectPage() {
  const [data, setData] = useState<TaskProjectData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<TaskProjectData | null>(null);
  const {user} = useAuth(); 
  const navigate = useNavigate();

    const fetchProject = async () => {
    try {
      const data = await ProjectServices.getAllProjects(); // Llama directamente al método del servicio
      console.log('Fetched Projects:', data);
      if (!Array.isArray(data)) {
        console.error('La respuesta de equipos no es un array:', data);
        return;
      }
      setData(data); // Actualiza el estado con los datos recibidos
      //console.log(await TeamService.getAllTeams());
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

     useEffect(() => {
      fetchProject(); // Llama a fetch cuando el componente se monta
      //fetchTeams();
    }, []);

  const handleCreate = () => {
    setEditingProject(null);
    setModalVisible(true);
  };

  const handleEdit = (record: TaskProjectData) => {
    setEditingProject({ ...record}); // Pasar idTeam al modal
    setModalVisible(true);
  };

const handleDelete = (id: string) => {
    if (user?.role.is_admin) {
      message.error('No tienes permisos para eliminar tareas.');
      return;
    }
    //Mostrar el modal de confirmación
    Modal.confirm({
      title: '¿Estás seguro de que quieres eliminar el Proyecto?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acción no se puede deshacer. Solo los proyectos sin tareas asignadas pueden ser eliminados.',
      okText: 'Sí, Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      
      onOk: async () => {
        try {
          if (id) {           
              await ProjectServices.deleteProject(id);
              message.success('Tarea eliminada correctamente');
              await fetchProject();
              return; 
          } else {
            console.error('No se encuentra ID del elemento.');
            message.error('No se encuentra ID del elemento');
          }
        } catch (error) {
          console.error('Error al eliminar tarea:', error);
          message.error('No se pudo eliminar la tarea.');
        }
      },
    
      onCancel() {
      },
    });
  };

  const handleSave = (values: TaskProjectData) => {
    if (editingProject) {
      // Edit existing project
      setData((prevData) =>
        prevData.map((item) => (item._id === editingProject._id ? { ...editingProject, ...values } : item))
      );
      message.success('Proyecto actualizado correctamente');
    } else {
      // Create new project
      setData((prevData) => [...prevData, { ...values, _id: Date.now().toString() }]);
      message.success('Proyecto creado correctamente');
    }
    setModalVisible(false);
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text.toUpperCase()}</strong>,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
    },    
    {
      title: 'Equipo',
      dataIndex: ['idTeam'],
      key: 'idTeam',
      render: (idTeam: { name: string } | undefined) => idTeam?.name.toUpperCase() || 'No asignado',
    },
    {
      title: 'Activo',
      dataIndex: 'is_deleted',
      key: 'is_deleted',
      render: (isDeleted: boolean) => (isDeleted ? 'No' : 'Sí'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: TaskProjectData) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Proyectos</h1>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>              
            <Button color="geekblue" variant="outlined" onClick={handleCreate} style={{ marginBottom: '20px' }}>
              Crear Proyecto
            </Button>
             {/* <p>Cantidad total de Tareas: {filteredTasks.length}</p> */}
            <Button color="geekblue" variant="solid" onClick={() => navigate('/taskProjectManagment')} style={{ marginBottom: '20px' }}>
              Tareas por Proyecto
            </Button>
            </div>
      <Table dataSource={data} columns={columns} rowKey="_id" />
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
    </div>
  );
};

export default TaskProjectPage;

