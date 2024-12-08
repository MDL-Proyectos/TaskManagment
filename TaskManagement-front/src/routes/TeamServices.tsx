import api from './ApiRoute';
import { TeamData } from '../components/Team';
 
const TeamService = {
  getAllTeams: (): Promise<TeamData[]> => api.get('/teams'),
  getTeamById: (id: string): Promise<TeamData> => api.get(`/teams/${id}`),
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