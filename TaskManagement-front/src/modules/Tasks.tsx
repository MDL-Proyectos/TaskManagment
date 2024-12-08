import { useState, useEffect } from 'react';
import { List, Skeleton, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Task from '../components/Task.tsx';
import TaskServices from '../routes/TaskServices.tsx';
import { TaskData } from '../components/Task.tsx';

function Tasks() {
  const [tasks, setTasks] = useState<TaskData[]>([]); 
  const [initLoading, setInitLoading] = useState(true);// Estado para controlar el loading
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const data = await TaskServices.getAllTask();

      setTasks(data); // Actualizar tareas
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setInitLoading(false);// Desactivar loading
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

  const handleDelete = async (id: any) => {
  
    try {
      console.log('Valores enviados:', id);  
      if (id) {
        console.log(id)
        const taskDeleted = await TaskServices.getTaskById(id);
        if (taskDeleted.status === 'Nuevo'){
          await TaskServices.deleteTask(id); 
          message.success('Tarea eliminada correctamente', id);
          
          return navigate('/tasks/'); // Redirigir después de guardar;
        }
        console.error('La tarea no puede eliminarse:', taskDeleted.status);
        message.error('La tarea no puede eliminarse: Su estado debe ser "Nuevo"');
          
        } else {
          console.error('No se encuentra ID del elemento.');
          message.error('No se encuentra ID del elemento');
          return;
        }
        navigate('/tasks/'); // Redirigir después de guardar
      
    } catch (error) {
      console.error('Error eliminar tarea:', error);
      message.error('No se pudo eliminar la tarea.');
    }
  };

  return (
    <>
      <h2>Listado de Tareas</h2>
      {initLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : tasks.length === 0 ? (
        <p>No hay tareas disponibles.</p>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            grid={{ gutter: 10, column: 1 }}
            dataSource={tasks}
            renderItem={(task) => (
              <List.Item
                actions={[
                  <a key="edit" onClick={() => handleEdit(task._id)}>Editar</a>,
                  <a key="delete" onClick={() => handleDelete(task._id)}>Eliminar</a>,
                ]}
              >
                <Skeleton avatar title={false} loading={initLoading} active>
                  <Task {...task} />
                </Skeleton>
              </List.Item>
            )}
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
