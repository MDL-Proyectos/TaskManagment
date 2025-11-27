import api from './ApiRoute';
import { UsuarioData } from '../entities/User';
 
const userService = {
  
  getUsers: async (): Promise<UsuarioData[]> => {
    const response = await api.get('/users');  
    return response.data; },

  getUserById: async (id: string): Promise<UsuarioData> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
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
  },
  validatePassword: async (id: string) => {
    const response = await api.post(`/users/p/${id}`);
    return response.data.valid;
  },
  resetPassword: async (id: string) => {
    const response = await api.put(`/users/p/reset/${id}`);
    return response.data.valid;
  }        
};
export default userService;