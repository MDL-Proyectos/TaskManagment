
export interface TaskData {
  _id: string;
  title: string; // Título de la tarea (obligatorio)
  assigned_team?: {_id: string; idTeam: string; name: string}; // Equipo asignado (opcional)
  assigned_user?: {_id: string; first_name: string; last_name: string}; // Usuario asignado (opcional)
  status: 'Nuevo' | 'En progreso' | 'Completado' | 'Cancelado'; // Estado de la tarea (obligatorio, valores enumerados)
  created_at?: Date; // Fecha de creación (opcional, por defecto es la fecha actual)
  due_date: Date; // Fecha de vencimiento (obligatoria)
  completed_at?: Date | null; // Fecha de finalización (opcional, por defecto null)
  updated_at?: Date | null; // Fecha de actualización (opcional, por defecto null)
  priorityLevel: 'Baja' | 'Media' | 'Alta'; // Nivel de prioridad (opcional, valores enumerados)
  comments?: {
    author: {_id: string; first_name: string; last_name: string}; // Autor del comentario (obligatorio)
    message: string; // Mensaje del comentario (obligatorio)
    created_at?: Date; // Fecha de creación del comentario (opcional, por defecto es la fecha actual)
  }[]; // Array de comentarios (opcional)
  project: {_id: string; name: string; status: string; idTeam: string}; // Proyecto al que pertenece la tarea (obligatorio)
  authorized_by?: {_id: string; first_name: string; last_name: string}; // Usuario que autoriza la tarea (opcional)
  observations?: string; // Observaciones adicionales (opcional, por defecto es una cadena vacía)
  description: string; // Descripción de la tarea (opcional, por defecto es una cadena vacía)
}
const Task  = ({title, assigned_team,assigned_user,status}: TaskData) => {
    return (
      <ul>
        <h4>Titulo: {title}</h4>
        <p>Status: {status}</p>
        <p>
        Team Asignado: {typeof assigned_team === 'string' 
          ? 'Referenciado por ID' 
          : `${assigned_team?.name}`}
      </p>
        <p>Responsable: {typeof assigned_user === 'string' 
        ? 'Referenciado por ID'
      : `${assigned_user?.first_name} ${assigned_user?.last_name} `}</p> 
      </ul>
    );
  };
  
  export default Task;