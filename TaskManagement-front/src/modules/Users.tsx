import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
//import listadoAlumnos from '../../data/alumnos.json'
import User from '../components/User.tsx'
import { Button } from 'antd'

// Definir los tipos para cada usuario
interface UsuarioData {
    legajo: string | number;
    nombre: string;
    condicion: string;  // Se puede hacer más específico si los valores posibles son limitados, como 'Inscripto'
    mail: string;
  }



  
  
  function Users() {
    // Tipar el estado de 'usuarios' como un array de 'UsuarioData'
    const [isFiltered, setIsFiltered] = useState(false);
    const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);  // Definir el tipo como array de 'UsuarioData'
    const navigate = useNavigate();

        // Función que se ejecutará al hacer clic en el botón
        const goToUsersPage = () => {
          navigate('/users')  // Redirige a la ruta '/users'
        }

    return (
      <>
        <h1>Listado de Usuarios</h1>
        <button onClick={goToUsersPage}>+ Usuario</button>
        {usuarios.length === 0 ? (
          <p>...</p>
        ) : (
          <>
            <ul>
              {usuarios.map((a) => (
                <User key={a.legajo} {...a} />
              ))}
            </ul>
            <p>Cantidad total de alumnos: {usuarios.length}</p>
              
          </>
        )}
      </>
    );
  }
  
  export default Users;