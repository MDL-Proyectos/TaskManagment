import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/authContext';
import TaskServices from '../services/TaskServices.tsx';
import { TaskData } from '../entities/Task.tsx';

// estados
type TaskStatus = 'Nuevo' | 'En Progreso' | 'Completado';

// El resultado del hook
interface TaskStats {
  total: number;
  [key: string]: number; // Permite acceder dinámicamente: stats.Nuevo, stats.Completado
}

// Valores iniciales para las estadisticas
const initialStats: TaskStats = {
  total: 0,
  'Nuevo': 0,
  'En Progreso': 0,
  'Completado': 0,
};

export const useTaskStats = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = !user?.role?.is_admin;
  const currentUserId = user?._id;

  useEffect(() => {
    //obtengo todas las tareas
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await TaskServices.getAllTask(); 
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
          setError('La respuesta del servidor no es válida.');
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Error al cargar las tareas desde el servicio.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const stats = useMemo(() => {
    const counts: TaskStats = { ...initialStats };
    let filteredTasks: TaskData[] = tasks; //el valor de la variable puede cambiar.
  //filtro de acuerdo al rol del usuario
    if (!isAdmin && currentUserId) {
      filteredTasks = tasks.filter(task => 
        task.assigned_user?._id === currentUserId
      );
    }
    // Excluir tareas con estado "cancelado"
    filteredTasks = filteredTasks.filter(task => task.status !== 'Cancelado');

    //cuento el total de las tareas
    counts.total = filteredTasks.length;
    //cuento las tareas por estado
    filteredTasks.forEach(task => {
      const status = task.status as TaskStatus;
      if (counts.hasOwnProperty(status)) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [tasks, isAdmin, currentUserId]); 

  return { stats, loading, error, isAdmin, currentUserId };
};