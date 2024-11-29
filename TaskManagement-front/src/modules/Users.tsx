import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import USERAPI from '../routes/UserServices.tsx';
import UserServices from '../routes/UserServices.tsx';
import User from '../components/User.tsx'
import { Button } from 'antd'
import { ObjectId } from 'mongoose';
import { UsuarioData } from '../components/User.tsx';

 
  function Users() {
    // Tipar el estado de 'usuarios' como un array de 'UsuarioData'
    const [isFiltered, setIsFiltered] = useState(false);
    const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);  // Definir el tipo como array de 'UsuarioData'
    const navigate = useNavigate();        

        const fetchUsers = async () => {
          try {
            const data = await UserServices.getUsers(); // Llama directamente al método del servicio
            setUsuarios(data); // Actualiza el estado con los datos recibidos
            console.log(await UserServices.getUsers());
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };

    // Usar useEffect para ejecutar fetchUsers cuando el componente se monta
    useEffect(() => {
      fetchUsers(); // Llama a fetchUsers cuando el componente se monta
    }, []); // El array vacío asegura que solo se ejecute una vez (al montar)

    // Función que se ejecutará al hacer clic en el botón
    const goToUsersPage = () => {
      navigate('/teams')  // Redirige a la ruta '/users'
    }        

    return (
      <>
        <h1>Listado de Usuarios</h1>
        {usuarios.length === 0 ? (
          <p>...</p>
        ) : (
          <>
            <ul>
              {usuarios.map((a) => (
                //<User key={a.first_name} {...a} />
                <User key={a.first_name} {...a} />
              ))}
            </ul>
            <p>Cantidad total de usuarios: {usuarios.length}</p>
            <button onClick={goToUsersPage}>+ Usuario</button>  
          </>
        )}
      </>
    );
  }
  
  export default Users;