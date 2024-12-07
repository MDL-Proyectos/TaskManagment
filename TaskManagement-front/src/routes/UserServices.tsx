import api from './ApiRoute';
import { UsuarioData } from '../components/User';
 
const userService = {
  getUsers: (): Promise<UsuarioData[]> => api.get('/users'),
  getUserById: (id: string): Promise<UsuarioData> => api.get(`/users/${id}`),
  createUser: async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/delete/${id}`);
    return response.data;
  }  
};
export default userService;