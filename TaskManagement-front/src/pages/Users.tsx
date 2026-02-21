import { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, message, Skeleton} from 'antd'; 
import type { TableProps } from 'antd'; 
import { useNavigate } from 'react-router-dom';
import UserServices from '../services/UserServices.tsx';
import { UsuarioData } from '../entities/User.tsx';
import { AlertOutlined, EditOutlined, UserAddOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import GlobalSearch from '../components/GlobalSearch.tsx';
import { useAuth } from '../contexts/authContext.tsx';
import AdminGuard from '../contexts/AdminGuard.tsx';

const { confirm } = Modal;
//const { Title } = Typography;

const Users = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [data, setData] = useState<UsuarioData[]>([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const {user} = useAuth(); 

  // Función para obtener los usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const response = await UserServices.getUsers();
      setInitLoading(false);
      setData(response); 
    } catch (error) {
      console.error('Error fetching users:', error);
      setInitLoading(false); 
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
  const handleResetPass = (id: string) => {
    //Mostrar el modal de confirmación
    confirm({
      title: '¿Estás seguro de que quieres resetear la Contraseña?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, resetear',
      okType: 'danger',
      cancelText: 'Cancelar',
      
      onOk: async () => {
        try {
          if (id) {
           // const userPassUpdated = await UserServices.getUserById(id);

              await UserServices.resetPassword(id);
              message.success('Reseteo realizado correctamente');
              return; 

          } else {
            console.error('No se encuentra ID del elemento: ');
            message.error('No se encuentra ID del elemento');
          }
        } catch (error) {
          console.error('Error al resetear pass:', error);
          message.error('Error al resetear la contraseña.');
        }
      },
    
      onCancel() {
      },
    });
  };
    const handleGlobalSearch = (value: string) => {
      // Limpiar el texto (trim) y pasarlo a minúsculas
      setSearchText(value.toLowerCase().trim()); 
    };

    const filteredUsers = data.filter(data => {

       if (user?.role.is_admin && user?._id) {
        // Si es Lider, podrá ver a su equipo.
        if (user.is_leader && data.team?._id == user?.team){
          return true;
        }
        // Solo su propia cuenta
        if (data._id !== user?._id) {
            return false; 
        }
    }
      // Si no hay texto de búsqueda, muestra todas las tareas
      if (!searchText) return true;

      const searchTerms = [
        data.first_name,
        data.last_name,
        data.email,
        data.role.name,
        data.team?.name,
        data.is_leader ? 'Lider de Equipo' : 'no Lider'
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
      sorter: (a, b) => a.role.name.localeCompare(b.role.name),
    },
    {
      title: 'Equipo',
      dataIndex: 'team',
      key: 'team',
      render: (team) => team?.name.toUpperCase() || 'No asignado',
      sorter: (a, b) => {
        const teamA = a.team ? a.team.name : '';
        const teamB = b.team ? b.team.name : '';
        return teamA.localeCompare(teamB);
      },
    },
    {
      title: 'Lider de Equipo',
      dataIndex: 'is_leader',
      key: 'is_leader',
      render: (isLeader) => isLeader ? 'Sí' : 'No',
      sorter: (a, b) => {
        const leaderA = a.is_leader ? 'Sí' : 'No';
        const leaderB = b.is_leader ? 'Sí' : 'No';
        return leaderA.localeCompare(leaderB);
      }
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

           <Button 
            icon={<AlertOutlined />} 
            onClick={() => handleResetPass(record._id)} 
            type="link"
          >
            Reset Password
          </Button>
        </Space>
      ),
    },
  ];

  return (
    
    <div style={{ width: '100%', height: '100%', padding: '20px' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> 
                <AdminGuard>
                    <Button
                  //Botón de Creación  
                    type="primary" 
                    icon={<UserAddOutlined />}
                    onClick={handleCreate}
                    style={{ marginBottom: 16 }} // Espacio debajo del botón
                  > Nuevo Usuario
                  </Button>                  
                </AdminGuard>
                <GlobalSearch 
                    onSearch={handleGlobalSearch} 
                    placeholder="Buscar por Nombre, Apellido o Email..."/>                
                </div>
      {initLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : filteredUsers.length === 0 ? (
            <div>
                <p>No hay usuarios.</p>
            </div>
        ) : (
          <div>
      <Table
        // El dataSource es la lista de datos a renderizar
        dataSource={filteredUsers}
        // El array de columns define la estructura de la tabla
        columns={columns}
        // loading usa el estado initLoading para mostrar un spinner mientras se cargan los datos
        loading={initLoading}
        // Key de la fila 
        rowKey="_id"
        // Paginación 
        pagination={{ pageSize: 9 }}
      />
    </div>
    )}
    </div>
  );
};

export default Users;