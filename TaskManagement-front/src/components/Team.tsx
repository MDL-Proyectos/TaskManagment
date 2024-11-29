import { ObjectId } from 'mongoose';

export interface TeamData {
  idTeam: string; // Identificador único del equipo (obligatorio)
  name: string; // Nombre del equipo, único, en minúsculas y sin espacios adicionales (obligatorio)
  liderTeam?: ObjectId; // Líder del equipo, referencia opcional a un usuario
}

const Team: React.FC<TeamData> = ({idTeam, name,liderTeam}) => {
    return (
      <li>
        <p>Identificación: {idTeam}</p>
        <p>Nombre: {name}</p>
        <p>Lider: {typeof liderTeam === 'string' ? liderTeam : 'Referenciado por ID'}</p>        
      </li>
    );
  };
  
  export default Team;