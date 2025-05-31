import { useState, useEffect } from 'react';
import { Skeleton, Button, message, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import TaskServices from '../routes/TaskServices.tsx';
import { TaskData } from '../entities/Task.tsx';
import TaskModal from '../components/forms/TaskModal.tsx';


function Tasks() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [initLoading, setInitLoading] = useState(true); // Estado para controlar el loading
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

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
    navigate('/tasks/new');
  };

  const handleEdit = (idTask: string) => {
    navigate(`/tasks/${idTask}`);
  };

  const handleDelete = async (id: string) => {
    try {
      if (id) {
        const taskDeleted = await TaskServices.getTaskById(id);
        if (taskDeleted.status === 'Nuevo') {
          await TaskServices.deleteTask(id); 
          message.success('Tarea eliminada correctamente');
           await fetchTasks();
          return navigate('/tasks/'); // Redirigir después de eliminar
        }
        console.error('La tarea no puede eliminarse:', taskDeleted.status);
        message.error('La tarea no puede eliminarse: Su estado debe ser "Nuevo"');
      } else {
        console.error('No se encuentra ID del elemento.');
        message.error('No se encuentra ID del elemento');
        return;
      }
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      message.error('No se pudo eliminar la tarea.');
    }
  };
  const ocultarColumna = true;

  const columns = [
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
    },
    {
      title: 'Equipo Asignado',
      dataIndex: 'assigned_team',
      key: 'assigned_team',
      render: (assigned_team: { name: string } | undefined) => assigned_team?.name || 'No asignado',
    },
    {
      title: 'Usuario Asignado',
      dataIndex: 'assigned_user',
      key: 'assigned_user',
      render: (assigned_user: { first_name: string; last_name: string } | undefined) =>
        assigned_user ? `${assigned_user.first_name} ${assigned_user.last_name}` : 'No asignado',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'Nuevo' | 'En progreso' | 'Completado') => (
        <span>{status}</span>
      ),
    },
    {
      title: 'Fecha de Vencimiento',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (due_date: string) => {
        // Función para convertir el formato dd-mm-yyyy a un objeto Date
        const convertToDate = (dateStr: string) => {
          const [day, month, year] = dateStr.split('-').map(Number);
          return new Date(year, month - 1, day); // Mes empieza desde 0 en JavaScript
        };
  
        const date = convertToDate(due_date);
        return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString();
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (task: TaskData) => (
        <>
          <a key="edit" onClick={() => {
          setEditingTaskId(task._id);
          setModalVisible(true);
        }}>Editar</a>
          <a key="delete" onClick={() => handleDelete(task._id)}>Eliminar</a>
        </>
      ),
    },
  ];

  const dataSource = tasks.map((task) => ({
    _id: task._id,
    title: task.title,
    assigned_team: task.assigned_team,
    assigned_user: task.assigned_user,
    status: task.status,
    due_date: task.due_date,
  }));

  return (
    <>
      <h2>Listado de Tareas</h2>
      {initLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : tasks.length === 0 ? (
        <p>No hay tareas disponibles.</p>
      ) : (
        <>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false} // Deshabilitar la paginación si no es necesaria
          />
          <p>Cantidad total de Tareas: {tasks.length}</p>
        </>
      )}
      <Button onClick={() => setModalVisible(true)}>Nueva Tarea</Button>
<TaskModal
  visible={modalVisible}
  idTask={editingTaskId}
  onClose={() => setModalVisible(false)}
  onSuccess={() => {
    setModalVisible(false);
    fetchTasks();
  }}
/>
    </>
    
  );
}

export default Tasks;
