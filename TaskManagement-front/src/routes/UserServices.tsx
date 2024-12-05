import api from './ApiRoute';
import { UsuarioData } from '../components/User';
 
const userService = {
  getUsers: (): Promise<UsuarioData[]> => api.get('/users'),
  getUserById: (id: string): Promise<UsuarioData> => api.get(`/users/${id}`),
};
export default userService;