import api from './ApiRoute';
import { TaskProjectData } from '../entities/TaskProject';
 
const ProjectServices = {
  
  getAllProjects: async (): Promise<TaskProjectData[]> => {
    const response = await api.get('/taskProject')
  return response.data; },
  getTaskById: async (id: string): Promise<TaskProjectData> => {
    const response = await api.get(`/taskProject/${id}`);
    return response.data;
  },
  createProject: async (TaskProjectData: any) => {
    const response = await api.post('/taskProject', TaskProjectData);
    return response.data;
  },
  updateProject: async (id: any, values: TaskProjectData) => {
    try {
      const response = await api.put(`/taskProject/${id}`, values); 
      return response.data; 
    } catch (error) {
      console.error('Error al actualizar:', error);
      throw error; 
    }
  },
  deleteProject: async (name: string) => {
    const response = await api.delete(`/taskProject/${name}`);
    return response.data;
  }    
};
export default ProjectServices;