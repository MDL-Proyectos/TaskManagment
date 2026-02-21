import { useState, useEffect } from 'react';
import { Skeleton, Button, message, Table, Space, Modal, TableProps, Select} from 'antd';
import TaskServices from '../services/TaskServices.tsx';
import { TaskData } from '../entities/Task.tsx';
import TaskModal from '../components/modals/TaskModal.tsx';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import GlobalSearch from '../components/GlobalSearch.tsx';
import dayjs from 'dayjs'; // Importar dayjs
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/authContext.tsx';
import { useDataFilter } from '../hooks/useDataFilter.tsx';
const { confirm } = Modal;
//const { Title } = Typography;
import AdminGuard from '../contexts/AdminGuard.tsx';
import { useLocation } from 'react-router-dom'; 

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
const location = useLocation();


const fetchTasks = async () => {
    try {
     setInitLoading(true);
      const data = await TaskServices.getAllTask();
              setInitLoading(false);
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
    if (location.state?.filterStatus) {
      // Si venimos del Home, filtramos el texto en el buscador 
      setSearchText(location.state.filterStatus.toLowerCase());
    }
  }, [location.state]);

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
    if (user?.role.is_admin && !user?.is_leader) {
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

  // Función para manejar el cambio de estado de la tarea
  const handleStatusChange = async (newStatus: string, idTask: string) => {
    try {
      //obtengo los atos de la tarea
      const taskToUpdate = await TaskServices.getTaskById(idTask); 

      //Valido que el estado actual y el nuevo estado no sean "Completado".
      if (taskToUpdate.status === 'Completado' && newStatus !== 'Completado') {
        message.error('No se puede cambiar el estado de una tarea completada a otro estado.');
        return;
      }
      
      //los datos de la task se mantienen pero alteno solo el estado
      taskToUpdate.status = newStatus as 'Nuevo' | 'En progreso' | 'Completado' | 'Cancelado';
      
      await TaskServices.updateTask(idTask, taskToUpdate);
      message.success('Estado de la tarea actualizado correctamente');
      
      await fetchTasks(); 
    
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      message.error('No se pudo actualizar el estado de la tarea.');
    } 
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
        task.project?.name,
        task.created_at,
        task.updated_at,
        task.due_date
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
      render: (status: string, record: TaskData) => (
      <Select
        value={status}
        style={{ width: 140}}
        onChange={(value) => handleStatusChange(value, record._id)}
        onClick={(e) => e.stopPropagation()} // Evita que se propaguen los eventos en los componentes padres e hijos.
        options={[
          { value: 'Nuevo', label: <span style={{color: 'green', fontWeight: 'bold'}} >Nuevo</span>},
          { value: 'En Progreso', label: <span style={{color: 'blue'}} >En Progreso</span>},
          { value: 'Completado', label: <span style={{color: 'purple'}} >Completado</span>},
          { value: 'Cancelado', label: <span style={{color: 'red'}} >Cancelado</span>},
        ]}
      />
  ),
  sorter : (a, b) => a.status.localeCompare(b.status),
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
    },
      sorter: (a, b) => {
      const timeA = a.created_at ? dayjs(a.created_at).valueOf() : 0;
      const timeB = b.created_at ? dayjs(b.created_at).valueOf() : 0;
      return timeA - timeB;
    }      
      },
    {
      title: 'Actualizado',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (updated_at: string | null | undefined) => {
        if (!updated_at) {
          return 'N/A';
        }
        // Usar dayjs para formatear la fecha ISO 8601
        const formattedDate = dayjs(updated_at).isValid()
          ? dayjs(updated_at).format('DD-MM-YYYY')
          : 'Fecha inválida'; 
          return formattedDate;
       },
        sorter: (a, b) => {
        const timeA = a.updated_at ? dayjs(a.updated_at).valueOf() : 0;
        const timeB = b.updated_at ? dayjs(b.updated_at).valueOf() : 0;
        return timeA - timeB;
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
      sorter: (a, b) => {
        const timeA = a.due_date ? dayjs(a.due_date).valueOf() : 0;
        const timeB = b.due_date ? dayjs(b.due_date).valueOf() : 0;
        return timeA - timeB;
      }
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
    <div style={{ width: '100%', height: '100%', padding: '10px', display: 'flex', flexDirection: 'column' }}>
      {/*<Title level={3} style={{ marginBottom: 30 }}>
        Listado de Tareas
      </Title>*/}
      {initLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : filteredTasks.length === 0 ? (
        <div>
          <GlobalSearch 
                onSearch={handleGlobalSearch} 
                placeholder="Buscar por Título, Usuario o Estado..."
              />
        <p>No hay tareas disponibles.</p>
        
        <AdminGuard>
          <Button 
            type="primary"
            icon={<PlusOutlined />} 
            onClick={handleCreate}
          >
            Crear nueva tarea
          </Button>
        </AdminGuard>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>              
          <AdminGuard>
          <Button 
            type="primary"
            icon={<PlusOutlined />} 
            onClick={handleCreate}
          >
            Crear nueva tarea
          </Button>
        </AdminGuard>
              <GlobalSearch 
                onSearch={handleGlobalSearch} 
                placeholder="Buscar por Título, Usuario o Estado..."
              />
            </div>
          <Table
            dataSource={filteredTasks}
            columns={columns}
            pagination={{
              pageSize: 10, // Mostrar 10 registros por página
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
