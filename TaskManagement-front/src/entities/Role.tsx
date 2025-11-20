
export interface RoleData {
  //_id: string;
  name: string;         // Nombre del usuario (obligatorio)
  is_admin?: boolean;    // Indica si el rol tiene privilegios de administrador (opcional, por defecto `false`)
  is_deleted?: boolean;       // Eliminación lógica (opcional, por defecto `false`)
}

const Role = ({ name, is_deleted, is_admin } : RoleData) => {
  return (
    <li>
      <p>ROL: {name} - Admin: {is_admin}</p>
    </li>
  );
};

export default Role;