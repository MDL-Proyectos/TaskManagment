import api from './ApiRoute';
import { UsuarioData } from '../components/User';
 
const userService = {
  getUsers: (): Promise<UsuarioData[]> => api.get('/users'),
  getUserById: (id: string): Promise<UsuarioData> => api.get(`/users/${id}`),
  createUser: async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  updateUser: async (id: any, values: UsuarioData) => {
    try {
      const response = await api.put(`/users/${id}`, values); // Envía los datos en el cuerpo de la solicitud
      return response.data; // Devuelve la respuesta del servidor
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error; // Lanza el error para manejarlo externamente
    }
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/delete/${id}`);
    return response.data;
  }  
};
export default userService;