import { useState, useEffect } from 'react';
import { Skeleton, Button, message, Table, Space, Modal, TableProps} from 'antd';
import { useNavigate } from 'react-router-dom';
import TaskServices from '../routes/TaskServices.tsx';
import { TaskData } from '../entities/Task.tsx';
import TaskModal from '../components/forms/TaskModal.tsx';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import GlobalSearch from '../components/forms/GlobalSearch';
import dayjs from 'dayjs'; // Importar dayjs
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;


function Tasks() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [initLoading, setInitLoading] = useState(true); // Estado para controlar el loading
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
const [searchText, setSearchText] = useState('');

 const fetchTasks = async () => {
  try {
    const data = await TaskServices.getAllTask();
    //console.log('Datos de tareas recibidos:', data); // Verificar los datos recibidos
    if (Array.isArray(data)) {
      setTasks(data); // Actualizar tareas solo si es un array
    } else {
      setTasks([]); // Si no es un array, deja tasks vacío
      console.error('La respuesta de tareas no es un array:', data);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    setTasks([]); // En caso de error, deja tasks vacío
  } finally {
    setInitLoading(false); // Desactivar loading
  }
};

  useEffect(() => {
    fetchTasks(); // Cargar las tareas cuando el componente se carga
  }, []);

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

    const filteredTasks = tasks.filter(task => {
      // Si no hay texto de búsqueda, muestra todas las tareas
      if (!searchText) return true;

      const searchTerms = [
        task.title,
        task.status,
        task.project,
        task.assigned_user?.first_name, 
        task.assigned_user?.last_name, 
        task.assigned_team?.name
      ].join(' ').toLowerCase(); // Unir todos los campos importantes en una sola cadena para buscar

      return searchTerms.includes(searchText);
    });

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
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'Nuevo' | 'En progreso' | 'Completado') => {
        let color = '';
        switch (status) {
          case 'Nuevo':
            color = 'grey';
            break;
          case 'En progreso':
            color = 'greenforest';
            break;
          case 'Completado':
            color = 'red';
            break;
          default:
            color = 'green';
        }
        return <span style={{ fontWeight: 'bold', color }}>{status.toUpperCase()}</span>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
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
  //Reemplazado por filteredTasks en dataSource
  const dataSource = tasks.map((task) => ({
    _id: task._id,
    title: task.title,
    assigned_team: task.assigned_team,
    assigned_user: task.assigned_user,
    status: task.status,
    due_date: task.due_date,
  }));

  return (
    <div style={{ width: '100%', maxWidth: '1200px', padding: '20px' }}>
      <h2>Listado de Tareas</h2>
      {initLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : tasks.length === 0 ? (
        <p>No hay tareas disponibles.</p>
      ) : (
        <>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
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
          <p>Cantidad total de Tareas: {tasks.length}</p>
        </>
      )}
      <Button 
        type="primary"
        icon={<PlusOutlined />} 
        onClick={handleCreate}
        style={{ marginBottom: 16 }}
      >
        Crear nueva tarea
      </Button>
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
