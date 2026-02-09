import api from './ApiRoute';
import { RoleData } from '../entities/Role';
 
const RoleServices = {
  
  getAllRole: async (): Promise<RoleData[]> => {
    const response = await api.get('/roles')
  return response.data; },
  getRoleByName: async (name: string): Promise<RoleData> => {
    const response = await api.get(`/roles/${name}`);
    return response.data;
  },
  createRole: async (RoleData: any) => {
    try{
    const response = await api.post('/roles', RoleData);
    return response.data;
  } catch (error) {
      console.error('Error al crear el rol:', error);
      throw error; 
    }
  },
  updateRole: async (name: any, values: RoleData) => {
    try {
      const response = await api.put(`/roles/${name}`, values); 
      return response.data; 
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      throw error; 
    }
  },
  deleteRole: async (name: string) => {
    try {
      const response = await api.delete(`/roles/${name}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el rol:', error);
      throw error; 
    }
  }    
};
export default RoleServices;