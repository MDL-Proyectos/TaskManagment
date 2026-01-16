export interface TeamData {
  _id?: string;
  idTeam: string; // Identificador único del equipo (obligatorio)
  name: string; // Nombre del equipo, único, en minúsculas y sin espacios adicionales (obligatorio)
  liderTeam?:   {_id: string; first_name: string; last_name: string}; 
  is_deleted?: boolean;       // Eliminación lógica 
}

const Team = ({idTeam, name,liderTeam}: TeamData) => {
    return (
      <li>
        <p>Identificación: {idTeam}</p>
        <p>Nombre: {name}</p>
        <p>{typeof liderTeam === 'string' 
        ? 'Referenciado por ID'
      : `${liderTeam?.first_name} ${liderTeam?.last_name} `}</p>        
      </li>
    );
  };
  
  export default Team;