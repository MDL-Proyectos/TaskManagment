import api from './ApiRoute';
import { TeamData } from '../components/Team';
 
const TeamService = {
  getAllTeams: (): Promise<TeamData[]> => api.get('/teams'),
  getTeamById: (id: string): Promise<TeamData> => api.get(`/teams/${id}`),
};
export default TeamService;