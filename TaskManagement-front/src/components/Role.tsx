
export interface RoleData {
  //_id: string;
  name: string;         // Nombre del usuario (obligatorio)
  is_deleted?: boolean;       // Eliminación lógica (opcional, por defecto `false`)
}

const Role = ({ name, is_deleted } : RoleData) => {
  return (
    <li>
      <p>ROL: {name}</p>
    </li>
  );
};

export default Role;