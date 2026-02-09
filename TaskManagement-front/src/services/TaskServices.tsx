import api from './ApiRoute';
import { TaskData } from '../entities/Task';
 
const userService = {
 
  getAllTask: async (): Promise<TaskData[]> =>{
    const response = await api.get('/task');
    return response.data; // Aquí sí es el array
  },    
  getTaskById: async (id: string): Promise<TaskData> => {
    const response = await api.get(`/task/${id}`);
  //  console.log('Respuesta de la tarea:', response.data);
    return response.data;
  },
  updateTask: async (id: any, values: TaskData) => {
    try {
      const response = await api.put(`/task/${id}`, values); 
      return response.data; 
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      throw error; 
    }
  },
  createTask: async (data: any) => {
    try{
    const response = await api.post('/task', data);
    return response.data;
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      throw error; 
    }
  },
  deleteTask: async (id: string) => {
    try{
    const response = await api.delete(`/task/delete/${id}`);
    return response.data;
  } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      throw error; 
    }
  }   
};
export default userService;