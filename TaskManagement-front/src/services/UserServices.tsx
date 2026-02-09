import api from './ApiRoute';
import { UsuarioData, PasswordInterface } from '../entities/User';

const userService = {
  
  getUsers: async (): Promise<UsuarioData[]> => {
    const response = await api.get('/users');  
    return response.data; },

  getUserById: async (id: string): Promise<UsuarioData> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  createUser: async (userData: any) => {
    try{
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw error; 
    }
  },
  updateUser: async (id: any, values: UsuarioData) => {
    try {
      const response = await api.put(`/users/${id}`, values); // Envía los datos en el cuerpo de la solicitud
      return response.data; // Devuelve la respuesta del servidor
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error; 
    }
  },
  deleteUser: async (id: string) => {
    try {
    const response = await api.delete(`/users/delete/${id}`);
    return response.data;
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      throw error; 
    }
  },
  validatePassword: async (id: any, values: PasswordInterface ) : Promise<boolean> => {
    try {
    const response = await api.put(`/users/p/validate/${id}`, values);
    return response.data;
  } catch (error) {
      console.error('Error al validar la contraseña:', error);
      throw error; 
    }
  },
  updatePasswordUser: async (id: any, values: PasswordInterface ) : Promise<boolean> => {
    try{
    const response = await api.put(`/users/p/${id}`, values);
    return response.data;
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      throw error; 
    }
  },
  resetPassword: async (id: string) => {
    try{
    const response = await api.put(`/users/p/reset/${id}`);
    return response.data.valid;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error; 
    }
  },
    getUserTask: async (id: string): Promise<boolean> => {
    const response = await api.get(`/users/taskUser/${id}`);
    const data = response.data;
    return data.hasTasks;
  },
         
};
export default userService;

