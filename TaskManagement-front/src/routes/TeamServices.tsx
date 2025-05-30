import api from './ApiRoute';
import { TeamData } from '../entities/Team';
 
const TeamService = {
  getAllTeams: async (): Promise<TeamData[]> => {
    const response = await api.get('/teams');
    return response.data; // Aquí sí es el array
  },
  getTeamById: async (id: string): Promise<TeamData> => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },
  updateTeam: async (id: any, values: TeamData) => {
    try {
      const response = await api.put(`/teams/${id}`, values); 
      return response.data; 
    } catch (error) {
      console.error('Error al actualizar el Team:', error);
      throw error; 
    }
  },
  createTeam: async (data: any) => {
    const response = await api.post('/teams', data);
    return response.data;
  },
};
export default TeamService;