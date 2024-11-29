import api from './ApiRoute';
import { AxiosResponse } from 'axios';
import { ObjectId } from 'mongoose';
import { UsuarioData } from '../components/User';
 
const userService = {
  getUsers: (): Promise<UsuarioData[]> => api.get('/users'),
  getUserById: (id: string): Promise<UsuarioData> => api.get(`/people/${id}`),
};
export default userService;