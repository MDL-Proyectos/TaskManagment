import api from './ApiRoute';
import { TaskData } from '../components/Task';
 
const userService = {
  getAllTask: (): Promise<TaskData[]> => api.get('/task'),
  getTaskById: (id: string): Promise<TaskData> => api.get(`/task/${id}`),
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
    const response = await api.post('/task', data);
    return response.data;
  },
  deleteTask: async (id: string) => {
    const response = await api.delete(`/task/delete/${id}`);
    return response.data;
  }   
};
export default userService;