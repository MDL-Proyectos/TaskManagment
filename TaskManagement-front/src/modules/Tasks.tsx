import { useState, useEffect } from 'react'
//import listadoAlumnos from '../../data/alumnos.json'
import Task from '../components/Task.tsx'
import { Button } from 'antd'
import { TaskData } from '../components/Task.tsx';
import { useNavigate } from 'react-router-dom';
import TaskServices from '../routes/TaskServices.tsx';

// Definir los tipos para cada usuario
  
  function Tasks() {
    const [tasks, setTask] = useState<TaskData[]>([]); 
    const navigate = useNavigate();   

    const fetchTask = async () => {
      try {
        const data = await TaskServices.getAllTask(); // Llama directamente al método del servicio
        setTask(data); // Actualiza el estado con los datos recibidos
       // console.log(await TaskServices.getAllTask());
      } catch (error) {
        console.error('Error fetching taks:', error);
      }
    };
    
    // Usar useEffect para ejecutar el fetch cuando el componente se carga
     useEffect(() => {
      fetchTask(); // Llama a fetch cuando el componente se monta
    }, []); // El array vacío asegura que solo se ejecute una vez (al carfgar)

    // Función que se ejecutará al hacer clic en el botón
    const goToUsersPage = () => {
      navigate('/users')  // Redirige a la ruta '/users'
    }       

    return (
      <>
        <h1>Listado de Tareas</h1>
        {tasks.length === 0 ? (
          <p>...</p>
        ) : (
          <>
            <ul>
              {tasks.map((t) => (           
                <Task key={t.title} {...t} />
              ))}
            </ul>
            <p>Cantidad total de Tareas: {tasks.length}</p>
            <button onClick={goToUsersPage}>Crear Tarea</button>  
          </>
        )}
        </>
    )
  }
  
  
  export default Tasks;