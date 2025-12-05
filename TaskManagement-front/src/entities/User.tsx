
export interface UsuarioData {
  _id: string;
  first_name: string;         // Nombre del usuario (obligatorio)
  last_name: string;          // Apellido del usuario (obligatorio)
  password: string;           // Contraseña (obligatoria, mínimo 6 caracteres)
  //team?: ObjectId | 'team';   // Equipo (puede ser una referencia de ObjectId o un string, opcional)
  team?: { idTeam: string; name: string };
  //role: ObjectId | 'usuario'; // Rol del usuario (ObjectId o 'usuario' por defecto)
  role: { _id: string; name: string };
  observations?: string;      // Observaciones adicionales (opcional)
  email: string;              // Correo del usuario (obligatorio, único, validado por regex)
  phone?: string; 
  is_leader?: boolean;           
  is_deleted?: boolean;       // Eliminación lógica (opcional, por defecto `false`)
}
const Usuario = ({ first_name, last_name, email, role, phone, team }: UsuarioData) => {
  return (
    <li>
      <p>Nombre: {first_name} {last_name}</p>
      <p>Email: {email}</p>
      <p>
        Rol: {typeof role === 'string' 
        ? 'Referenciado por ID'
        : `${role?.name}`}</p>
      <p>
        Team: {typeof team === 'string' 
          ? 'Referenciado por ID' 
          : `${team?.name}`}
      </p>
      {phone && <p>Teléfono: {phone}</p>}
    </li>
  );
};

export interface PasswordInterface {
  _id: string;
  password: string;          
  currentpassword: string;           
  email: string;             
  is_deleted?: boolean;       
  first_name: string;         
  last_name: string;          
}

export default Usuario;
