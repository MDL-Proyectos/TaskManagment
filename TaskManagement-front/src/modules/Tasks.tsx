import { useState, useEffect } from 'react';
import { List, Skeleton, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Task from '../components/Task.tsx';
import TaskServices from '../routes/TaskServices.tsx';
import { TaskData } from '../components/Task.tsx';

function Tasks() {
  const [tasks, setTasks] = useState<TaskData[]>([]); 
  const [loading, setLoading] = useState(true); // Estado para controlar el loading
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const data = await TaskServices.getAllTask();
      setTasks(data); // Actualizar tareas
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false); // Desactivar loading
    }
  };

  useEffect(() => {
    fetchTasks(); // Cargar las tareas cuando el componente se carga
  }, []);

  const goToUsersPage = () => {
    navigate('/users'); // Redirige a la página de creación de usuarios
  };

  return (
    <>
      <h1>Listado de Tareas</h1>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : tasks.length === 0 ? (
        <p>No hay tareas disponibles.</p>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={tasks}
            renderItem={(task) => (
              <List.Item
                actions={[
                  <a key="edit">Editar</a>,
                  <a key="delete">Eliminar</a>,
                ]}
              >
                <Skeleton avatar title={false} loading={loading} active>
                  <Task {...task} />
                </Skeleton>
              </List.Item>
            )}
          />
          <p>Cantidad total de Tareas: {tasks.length}</p>
        </>
      )}
      <Button type="primary" onClick={goToUsersPage}>
        Crear Tarea
      </Button>
    </>
  );
}

export default Tasks;
