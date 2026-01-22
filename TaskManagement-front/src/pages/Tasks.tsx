import { useState, useEffect } from 'react';
import { Skeleton, Button, message, Table, Space, Modal, TableProps, Typography} from 'antd';
import TaskServices from '../routes/TaskServices.tsx';
import { TaskData } from '../entities/Task.tsx';
import TaskModal from '../components/forms/TaskModal.tsx';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import GlobalSearch from '../components/forms/GlobalSearch';
import dayjs from 'dayjs'; // Importar dayjs
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/authContext.tsx';
import { useDataFilter } from '../hooks/useDataFilter.tsx';
const { confirm } = Modal;
const { Title } = Typography;

interface TasksProps {
  projectId?: string; 
}

function Tasks({ projectId }: TasksProps) {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [initLoading, setInitLoading] = useState(true); // Estado para controlar el loading
  const [modalVisible, setModalVisible] = useState(false);
const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
const [searchText, setSearchText] = useState('');
const {user} = useAuth(); 

const fetchTasks = async () => {
    try {
      setInitLoading(true);
      const data = await TaskServices.getAllTask();
      if (Array.isArray(data)) {
        // FILTRADO: Si hay projectId, filtramos las tareas
        const filtered = projectId 
          ? data.filter(t => t.project?._id === projectId) 
          : data;
        setTasks(filtered);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setInitLoading(false);
    }
  };

useEffect(() => {
    fetchTasks();
  }, [projectId]);
  
  const handleCreate = () => {
   // navigate('/tasks/new');
    setEditingTaskId(null);
    setModalVisible(true);
  };

  const handleEdit = (idTask: string) => {
    setEditingTaskId(idTask);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    if (user?.role.is_admin) {
      message.error('No tienes permisos para eliminar tareas.');
      return;
    }
    //Mostrar el modal de confirmación
    confirm({
      title: '¿Estás seguro de que quieres eliminar esta Tarea?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acción no se puede deshacer. Solo las tareas con estado "Nuevo" pueden eliminarse.',
      okText: 'Sí, Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      
      onOk: async () => {
        try {
          if (id) {
            const taskDeleted = await TaskServices.getTaskById(id);
            
            // Verificar el estado de la tarea antes de eliminar
            if (taskDeleted.status === 'Nuevo') {
              await TaskServices.deleteTask(id);
              message.success('Tarea eliminada correctamente');
              await fetchTasks();
              return; 
            }
            
            console.error('La tarea no puede eliminarse:', taskDeleted.status);
            message.error('La tarea no puede eliminarse: Su estado debe ser "Nuevo"');
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
  
  const handleGlobalSearch = (value: string) => {
      //Limpiar el texto (trim) y pasarlo a minusculas
      setSearchText(value.toLowerCase().trim()); 
    };

    const filteredTasks = useDataFilter(
    tasks, 
    searchText, 
    // Función de mapeo específica para TaskData
    (task: TaskData) => 
      [
        task.title,
        task.status,
        task.project,
        task.assigned_user?.first_name, 
        task.assigned_user?.last_name, 
        task.assigned_team?.name,
        task.project?.name
      ].join(' ')
  );

  const ocultarColumna = true;

  const columns: TableProps<TaskData>['columns'] = [
    {
      title: 'idTask',
      dataIndex: '_id',
      key: '_id',
      hidden: ocultarColumna
    },
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Equipo Asignado',
      dataIndex: 'assigned_team',
      key: 'assigned_team',
      render: (assigned_team: { name: string } | undefined) => assigned_team?.name || 'No asignado',
      sorter: (a, b) => a.assigned_team?.name.localeCompare(b.assigned_team?.name || '') || 0,
    },
    
    {
      title: 'Usuario Asignado',
      dataIndex: 'assigned_user',
      key: 'assigned_user',
      render: (assigned_user: { first_name: string; last_name: string } | undefined) =>
        assigned_user ? `${assigned_user.first_name} ${assigned_user.last_name}` : 'No asignado',
      sorter: (a, b) => a.assigned_user?.first_name.localeCompare(b.assigned_user?.first_name || '') || 0,
    },
    {
      title: 'Proyecto',
      dataIndex: 'project',
      key: 'project',
      render: (project: { name: string } | undefined) =>
        project ? `${project.name.toUpperCase()}` : 'No Definido',
      sorter: (a, b) => a.project?.name.localeCompare(b.project?.name || '') || 0,
    },    
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'Nuevo' | 'En Progreso' | 'Completado' | 'Cancelado') => {
        let color = '';
        switch (status) {
          case 'Nuevo':
            color = 'grey';
            break;
          case 'En Progreso':
            color = 'green';
            break;
          case 'Completado':
            color = 'purple';
            break;
          case 'Cancelado':
            color = 'orange';
            break;
          default:
            color = 'blue';
        }
        return <span style={{ fontWeight: 'bold', color }}>{status.toUpperCase()}</span>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Prioridad',
      dataIndex: 'priorityLevel',
      key: 'priorityLevel',
      render: (priorityLevel: 'Baja' | 'Media' | 'Alta') => {
        let color = '';
        switch (priorityLevel) {
          case 'Baja':
            color = 'grey';
            break;
          case 'Media':
            color = 'blue';
            break;
          case 'Alta':
            color = 'red';
            break;
          default:
            color = 'red';
        }
        return <span style={{ fontWeight: 'bold', color }}>{priorityLevel.toUpperCase()}</span>;
      },
      sorter: (a, b) => a.priorityLevel.localeCompare(b.priorityLevel),
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at: string | null | undefined) => {
        if (!created_at) {
          return 'N/A';
        }
        // Usar dayjs para formatear la fecha ISO 8601
        const formattedDate = dayjs(created_at).isValid()
          ? dayjs(created_at).format('DD-MM-YYYY')
          : 'Fecha inválida'; 
          return formattedDate;
    }      
      },
    {
      title: 'Fecha de Vencimiento',
      dataIndex: 'due_date',
      key: 'due_date',
          render: (due_date: string | null | undefined) => {
        if (!due_date) {
          return 'N/A';
        }

        // Usar dayjs para formatear la fecha ISO 8601
        const formattedDate = dayjs(due_date).isValid()
          ? dayjs(due_date).format('DD-MM-YYYY')
          : 'Fecha inválida';

        return formattedDate;
      },
    },

    {
      title: 'Acciones',
      key: 'actions',
      render: (task: TaskData) => (
        <Space size="middle">
          <a key="edit" onClick={() => handleEdit(task._id)}>
              <EditOutlined /> Editar
            </a>
          <a key="delete" onClick={() => handleDelete(task._id)}><DeleteOutlined />Eliminar</a>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', padding: '10px', display: 'flex', flexDirection: 'column' }}>
      <Title level={3} style={{ marginBottom: 30 }}>
        Listado de Tareas
      </Title>
      {initLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : filteredTasks.length === 0 ? (
        <div>
          <GlobalSearch 
                onSearch={handleGlobalSearch} 
                placeholder="Buscar por Título, Usuario o Estado..."
              />
        <p>No hay tareas disponibles.</p>
         <Button 
                type="primary"
                icon={<PlusOutlined />} 
                onClick={handleCreate}
              >Crear nueva tarea
              </Button>
        </div>
      ) : (
        <>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>              
              <Button 
                type="primary"
                icon={<PlusOutlined />} 
                onClick={handleCreate}
              >Crear nueva tarea
              </Button>
             {/* <p>Cantidad total de Tareas: {filteredTasks.length}</p> */}
              <GlobalSearch 
                onSearch={handleGlobalSearch} 
                placeholder="Buscar por Título, Usuario o Estado..."
              />
            </div>
          <Table
            dataSource={filteredTasks}
            columns={columns}
            pagination={{
              pageSize: 8, // Mostrar 10 registros por página
              showSizeChanger: false, // Deshabilitar el cambio de tamaño de página
            }}
          />
        </>
      )}
      
<TaskModal
  visible={modalVisible}
  idTask={editingTaskId}
  onClose={() => {
    setModalVisible(false); // Cierra el modal
    setEditingTaskId(null); // Asegura que el ID quede limpio
  }}
  onSuccess={() => {
    setModalVisible(false);
    setEditingTaskId(null); 
    fetchTasks();
  }}
/>
    </div>
    
  );
}

export default Tasks;
