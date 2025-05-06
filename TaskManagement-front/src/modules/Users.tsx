import React, { useState, useEffect } from 'react';
import { Avatar, Button, List } from 'antd';
import { useNavigate } from 'react-router-dom';
import UserServices from '../routes/UserServices.tsx';
import { UsuarioData } from '../components/User.tsx';

//const count = 3; // Número de usuarios por "página"

const Users = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [data, setData] = useState<UsuarioData[]>([]);
  const [list, setList] = useState<UsuarioData[]>([]);
  const navigate = useNavigate();

  // Función para obtener los usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const response = await UserServices.getUsers(); // Llama al servicio para obtener los usuarios
      setInitLoading(false);
      setData(response); // Los datos de los usuarios
      setList(response); // Los datos que se mostrarán en la lista
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para manejar la acción de editar
  const handleEdit = (userId: string) => {
    navigate(`/users/${userId}`); // Redirige a la ruta de edición con el ID del usuario
  };

    // Función para manejar la acción de crear
    const handleCreate = () => {
      navigate(`/users/create`); // Redirige a la ruta de edición con el ID del usuario
    };

  return (
    <div>
      <h1>Listado de Usuarios</h1>

      <List
        itemLayout="horizontal"
        loading={initLoading}
        dataSource={list}
        renderItem={(user, index) => (
          
          <List.Item
          actions={[
            <a key="edit" onClick={() => handleEdit(user._id)}>Editar</a>
          ]}>
            <List.Item.Meta
              avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
              title={<a href={`/users/${user.email}`}>{user?.first_name} {user?.last_name}</a>}
              description={`Email: ${user.email}`}
              />
          </List.Item>
        )}
        
      />
      <Button type="primary" onClick={() => handleCreate()}>
        Nuevo Usuario
      </Button>
    </div>
  );
};

export default Users;
