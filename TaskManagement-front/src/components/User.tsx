import React from 'react';

// Definir los tipos de las props que recibe el componente
interface UsuarioProps {
  legajo: string | number;  // Depende de cómo se usa en tu sistema
  nombre: string;
  condicion: string;        // Puede ser más específico si sabes los posibles valores
  mail: string;
}

const Usuario: React.FC<UsuarioProps> = ({ legajo, nombre, condicion, mail }) => {
  return (
    <li>
      Legajo: {legajo}. Nombre: {nombre}.{' '}
      {condicion === 'Inscripto' && `Mail: ${mail}`}
    </li>
  );
};

export default Usuario;
