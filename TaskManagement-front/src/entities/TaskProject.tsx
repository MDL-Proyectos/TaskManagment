
export interface TaskProjectData {
  _id: string;
  name: string;         // Nombre del usuario (obligatorio) 
  status: 'Abierto' | 'Cerrado' | 'Cancelado'; 
  assigned_team?: { _id: string; idTeam: string; name: string };
  is_deleted?: boolean;       // Eliminación lógica (opcional, por defecto `false`)
}