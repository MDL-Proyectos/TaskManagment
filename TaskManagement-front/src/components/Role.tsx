import React from 'react';

export interface RoleData {
  //_id: string;
  name: string;         // Nombre del usuario (obligatorio)
  is_deleted?: boolean;       // Eliminación lógica (opcional, por defecto `false`)
}


const Role: React.FC<RoleData> = ({name, is_deleted}) => {
  return (
    <li>
      <p>ROL: {name}</p>
    </li>
  );
};

export default Role;