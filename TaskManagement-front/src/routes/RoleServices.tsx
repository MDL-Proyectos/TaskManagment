import api from './ApiRoute';
import { RoleData } from '../components/Role';
 
const RoleServices = {
  getAllRole: (): Promise<RoleData[]> => api.get('/roles'),
  getRoleByName: (name: string): Promise<RoleData> => api.get(`/roles/${name}`),
  createRole: async (RoleData: any) => {
    const response = await api.post('/roles', RoleData);
    return response.data;
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
    const response = await api.delete(`/roles/${name}`);
    return response.data;
  }    
};
export default RoleServices;