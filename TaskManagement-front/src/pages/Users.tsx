import React, { useState, useEffect } from 'react';
import { Button, Table, Space } from 'antd'; // Importamos Table y Space
import type { TableProps } from 'antd'; // Importamos tipos si usas TypeScript
import { useNavigate } from 'react-router-dom';
import UserServices from '../routes/UserServices.tsx';
import { UsuarioData } from '../entities/User.tsx';
// importamos los iconos que podrías necesitar para las acciones (opcional)
import { EditOutlined, UserAddOutlined } from '@ant-design/icons';
import GlobalSearch from '../components/forms/GlobalSearch';


const Users = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [data, setData] = useState<UsuarioData[]>([]);
  const [searchText, setSearchText] = useState('');
  // 'list' ya no es necesario; usamos 'data' directamente en la Table
  const navigate = useNavigate();

  // Función para obtener los usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const response = await UserServices.getUsers();
      setInitLoading(false);
      setData(response); 
    } catch (error) {
      console.error('Error fetching users:', error);
      setInitLoading(false); // Es importante detener la carga incluso en error
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para manejar la acción de editar
  const handleEdit = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  // Función para manejar la acción de crear
  const handleCreate = () => {
    navigate(`/users/create`);
  };

    const handleGlobalSearch = (value: string) => {
      // 1. Limpiar el texto (trim) y pasarlo a minúsculas
      setSearchText(value.toLowerCase().trim()); 
      // 2. Opcional: Si implementas paginación, puedes resetear la página a 1 aquí.
      // setPagination(prev => ({...prev, current: 1}));
    };

    const filteredUsers = data.filter(data => {
      // Si no hay texto de búsqueda, muestra todas las tareas
      if (!searchText) return true;

      const searchTerms = [
        data.first_name,
        data.last_name,
        data.email,
        data.role.name,
        data.team?.name // Búsqueda anidada
      ].join(' ').toLowerCase(); // Unir todos los campos importantes en una sola cadena para buscar

      return searchTerms.includes(searchText);
    });

  const columns: TableProps<UsuarioData>['columns'] = [
    {
      title: 'Nombre',
      // dataIndex es el campo del objeto 'UsuarioData' que se debe mostrar
      dataIndex: 'first_name', 
      key: 'first_name',
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: 'Apellido',
      dataIndex: 'last_name',
      key: 'last_name',
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (role) => role.name.toUpperCase()|| 'No asignado',
    },
    {
      title: 'Equipo',
      dataIndex: 'team',
      key: 'team',
      render: (team) => team?.name.toUpperCase() || 'No asignado',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      // Para hacer la columna ordenable por email
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Acciones',
      key: 'actions',
      // Renderiza los botones de acción para cada fila
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record._id)} 
            type="link"
          >
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', padding: '20px' }}>
      <h1>Listado de Usuarios</h1>
      
      
      <Button
      //Botón de Creación  
        type="primary" 
        icon={<UserAddOutlined />}
        onClick={handleCreate}
        style={{ marginBottom: 16 }} // Espacio debajo del botón
      >
        Nuevo Usuario
      </Button>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <GlobalSearch 
                onSearch={handleGlobalSearch} 
                placeholder="Buscar..."
              />
       </div>
      <Table
        // El dataSource es la lista de datos a renderizar
        dataSource={filteredUsers}
        // El array de columns define la estructura de la tabla
        columns={columns}
        // loading usa el estado que ya tienes
        loading={initLoading}
        // Key de la fila (Antd prefiere 'key' pero 'rowKey' es más flexible)
        rowKey="_id"
        // Paginación (opcional, Antd la incluye por defecto)
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Users;