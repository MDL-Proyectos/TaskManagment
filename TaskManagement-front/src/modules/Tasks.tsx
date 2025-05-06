import { useState, useEffect } from 'react';
import { Skeleton, Button, message, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import TaskServices from '../routes/TaskServices.tsx';
import { TaskData } from '../components/Task.tsx';

function Tasks() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [initLoading, setInitLoading] = useState(true); // Estado para controlar el loading
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const data = await TaskServices.getAllTask();
      setTasks(data); // Actualizar tareas
    } catch (error) {
      console.error('Error fetching tasks:', error);
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

  const columns = [
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
          <a key="edit" onClick={() => handleEdit(task._id)}>Editar</a>
          <a key="delete" onClick={() => handleDelete(task._id)}>Eliminar</a>
        </>
      ),
    },
  ];

  const dataSource = tasks.map((task) => ({
    key: task._id,
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
      <Button type="primary" onClick={handleCreate}>
        Crear Tarea
      </Button>
    </>
  );
}

export default Tasks;
