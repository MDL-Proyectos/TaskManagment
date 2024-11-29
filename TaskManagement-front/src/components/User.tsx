import React from 'react';
import { ObjectId } from 'mongoose';


export interface UsuarioData {
  first_name: string;         // Nombre del usuario (obligatorio)
  last_name: string;          // Apellido del usuario (obligatorio)
  password: string;           // Contraseña (obligatoria, mínimo 6 caracteres)
  team?: string | ObjectId;   // Equipo (puede ser una referencia de ObjectId o un string, opcional)
  role: ObjectId | 'usuario'; // Rol del usuario (ObjectId o 'usuario' por defecto)
  observations?: string;      // Observaciones adicionales (opcional)
  email: string;              // Correo del usuario (obligatorio, único, validado por regex)
  phone?: string;             // Teléfono (opcional)
  is_deleted?: boolean;       // Eliminación lógica (opcional, por defecto `false`)
}

const Usuario: React.FC<UsuarioData> = ({ first_name, last_name, email, role, observations, phone }) => {
  return (
    <li>
      <p>Nombre: {first_name} {last_name}</p>
      <p>Email: {email}</p>
      <p>Rol: {typeof role === 'string' ? role : 'Referenciado por ID'}</p>
      {phone && <p>Teléfono: {phone}</p>}
      {observations && <p>Observaciones: {observations}</p>}
    </li>
  );
};

export default Usuario;
