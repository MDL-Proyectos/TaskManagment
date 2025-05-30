import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import RoleServices from '../routes/RoleServices';
import { RoleData } from '../entities/Role';
//import userService from '../../services/users'
import { List } from 'antd';
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function Role() {
  const [roles, setRole] = useState<RoleData[]>([]);
  const navigate = useNavigate();   

  const fetchRoles = async () => {
    try {
      const data = await RoleServices.getAllRole(); // Llama directamente al método del servicio
      setRole(data); // Actualiza el estado con los datos recibidos
      //console.log(await TeamService.getAllTeams());
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

   // Usar useEffect para ejecutar el fetch cuando el componente se carga
   useEffect(() => {
    fetchRoles(); // Llama a fetch cuando el componente se monta
  }, []); // El array vacío asegura que solo se ejecute una vez (al cargar)

  // Función que se ejecutará al hacer clic en el botón
  const handleEdit = (name: string) => {
    navigate(`/users/role/${name}`); // Redirige a la ruta de edición con el ID del usuario
  }; 

  const handleCreate = () => {
    navigate(`/users/role/create`); // Redirige a la ruta de edición con el ID del usuario
  }; 

  return (
    <div>
        <h2>Roles en sistema</h2>
      <List
        itemLayout="horizontal"
       // loading={initLoading}
       grid={{ gutter: 5, column: 1 }}
        dataSource={roles}
        renderItem={(role) => (
          
          <List.Item
          actions={[
            <a key="edit" onClick={() => handleEdit(role.name)}>Editar</a>
          ]}>
            <List.Item.Meta
              avatar={<Avatar shape="square" icon={<UserOutlined />} />}
              title={<a href={`/users/${role.name}`}>{role?.name} </a>}
              />
          </List.Item>
        )}
        
      />
      <Button type="primary" onClick={() => handleCreate()}>
        Nuevo Rol
      </Button>
    </div>
  );
}
  
export default Role