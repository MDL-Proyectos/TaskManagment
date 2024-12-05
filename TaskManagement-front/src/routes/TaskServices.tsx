import api from './ApiRoute';
import { TaskData } from '../components/Task';
 
const userService = {
  getAllTask: (): Promise<TaskData[]> => api.get('/task'),
  getTaskById: (id: string): Promise<TaskData> => api.get(`/task/${id}`),
};
export default userService;