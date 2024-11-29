import { ObjectId } from 'mongoose';

export interface TaskData {
  title: string; // Título de la tarea (obligatorio)
  assigned_team?: ObjectId; // Equipo asignado (opcional)
  assigned_user?: ObjectId; // Usuario asignado (opcional)
  status: 'Nuevo' | 'En progreso' | 'Completado'; // Estado de la tarea (obligatorio, valores enumerados)
  created_at?: Date; // Fecha de creación (opcional, por defecto es la fecha actual)
  due_date: Date; // Fecha de vencimiento (obligatoria)
  completed_at?: Date | null; // Fecha de finalización (opcional, por defecto null)
  comments?: {
    author: ObjectId; // Autor del comentario (obligatorio)
    message: string; // Mensaje del comentario (obligatorio)
    created_at?: Date; // Fecha de creación del comentario (opcional, por defecto es la fecha actual)
  }[]; // Array de comentarios (opcional)
  project: string; // Proyecto al que pertenece la tarea (obligatorio)
  authorized_by?: ObjectId; // Usuario que autoriza la tarea (opcional)
  observations?: string; // Observaciones adicionales (opcional, por defecto es una cadena vacía)
}

const Task: React.FC<TaskData> = ({title, assigned_team,assigned_user,status,created_at,project,authorized_by}) => {
    return (
      <li>
        <p>Titulo: {title}</p>
        <p>Status: {status}</p>
        <p>Team Asignado: {typeof assigned_team === 'string' ? assigned_team : 'Referenciado por ID'}</p>
        <p>Responsable: {typeof assigned_user === 'string' ? assigned_user : 'Referenciado por ID'}</p> 
      </li>
    );
  };
  
  export default Task;