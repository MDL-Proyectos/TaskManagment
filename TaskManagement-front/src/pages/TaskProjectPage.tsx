import { useEffect, useState } from 'react';
import { Button, Table, Modal, message, Skeleton } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProjectTaskModal from '../components/modals/ProjectTaskModal.tsx';
import { TaskProjectData } from '../entities/TaskProject';
import ProjectServices from '../services/ProjectServices.tsx';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Card from 'antd/es/card/Card';
import GlobalSearch from '../components/GlobalSearch.tsx';
import { useDataFilter } from '../hooks/useDataFilter.tsx';


function TaskProjectPage() {
  const [data, setData] = useState<TaskProjectData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [initLoading, setInitLoading] = useState(true); 
  const [editingProject, setEditingProject] = useState<TaskProjectData | null>(null);
  const {user} = useAuth(); 
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

    const fetchProject = async () => {
      setInitLoading(true);
    try {
      const data = await ProjectServices.getAllProjects(); // Llama directamente al método del servicio
      
      if (!Array.isArray(data)) {
        console.error('La respuesta de equipos no es un array:', data);
        setInitLoading(false);
        return;
      }
      setData(data); // Actualiza el estado con los datos recibidos
      setInitLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setInitLoading(false);
    }
  };

     useEffect(() => {
      fetchProject(); // Llama a fetch cuando el componente se monta
      //fetchTeams();
    }, []);

  const handleCreate = () => {
    console.log('Crear nuevo proyecto');
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
              message.success('Proyecto eliminado correctamente');
              await fetchProject();
              return; 
          } else {
            console.error('No se encuentra ID del elemento.');
            message.error('No se encuentra ID del elemento');
          }
        } catch (error) {
          console.error('Error al eliminar proyecto:', error);
          message.error('No se pudo eliminar el proyecto.');
        }
      },
    
      onCancel() {
      },
    });
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
      dataIndex: ['assigned_team'],
      key: 'assigned_team',
      render: (assigned_team: { name: string } | undefined) => assigned_team?.name.toUpperCase() || 'No asignado',
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

      const handleGlobalSearch = (value: string) => {
        //Limpiar el texto (trim) y pasarlo a minusculas
        setSearchText(value.toLowerCase().trim()); 
      };
  
      const filteredProjects = useDataFilter(
      data, 
      searchText, 
      // Función de mapeo específica para TaskData
      (project: TaskProjectData) => 
        [
          project.name,
          project.status,
          project.assigned_team?.name
        ].join(' ')
    );
  


  return (
    <div>
       <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'right', marginBottom: 2}}>
        <GlobalSearch 
            onSearch={handleGlobalSearch} 
            placeholder="Buscar por Nombre, Equipo o Estado..."
          />
        </div>
        <div>{initLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : filteredProjects.length === 0 ? (
            <div>
            <p>No hay proyectos disponibles.</p>
            <Button color="geekblue" variant="outlined" onClick={handleCreate} style={{ marginBottom: '20px' }}>
              Crear Proyecto
            </Button>
            </div>
          ) : (
            <Card style={{ padding: '20px' }}>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>              
                <Button color="geekblue" variant="outlined" onClick={handleCreate} style={{ marginBottom: '20px' }}>
                  Crear Proyecto
                </Button>
             {/* <p>Cantidad total de Tareas: {filteredTasks.length}</p> */}
            <Button color="geekblue" variant="solid" onClick={() => navigate('/taskProjectManagment')} style={{ marginBottom: '20px' }}>
              Tareas por Proyecto
            </Button>
            </div>
      <Table dataSource={filteredProjects} columns={columns} rowKey="_id" 
          pagination={{
          pageSize: 6, 
          showSizeChanger: false
        }}/>

    </Card>
          )}
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
        </div>
  );
};

export default TaskProjectPage;

