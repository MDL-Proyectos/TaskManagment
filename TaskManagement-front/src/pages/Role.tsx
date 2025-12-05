import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import RoleServices from '../routes/RoleServices';
import { RoleData } from '../entities/Role';
//import userService from '../../services/users'
import { Card, List, Typography } from 'antd';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import GlobalSearch from '../components/forms/GlobalSearch';

const { Title } = Typography;
function Role() {
  const [roles, setRole] = useState<RoleData[]>([]);
  const navigate = useNavigate();   
  const [searchText, setSearchText] = useState('');

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

   const handleGlobalSearch = (value: string) => {
        setSearchText(value.toLowerCase().trim()); 
      };

    const filteredRoles = roles.filter(roles => {
      // Si no hay texto de búsqueda, muestra todas las tareas
      if (!searchText) return true;

      const searchTerms = [
        roles.name,
      ].join(' ').toLowerCase(); // Unir todos los campos importantes en una sola cadena para buscar

      return searchTerms.includes(searchText);
    });

  return (
    <div style={{ width: '100%', maxWidth: '1200px', padding: '20px' }}>
        <Title level={2} style={{ marginBottom: 50 }}>Roles en sistema</Title>
        <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'flex-end'}}>
              <GlobalSearch 
                onSearch={handleGlobalSearch} 
                placeholder="Buscar por Nombre o Lider..."
              />
            </div>
      {roles.length === 0 ? (
        <p>No hay roles disponibles.</p>
      ) : (
        <List
          grid={{ gutter: 20, column: 4 }}
          dataSource={filteredRoles}
          renderItem={(role) => (
            <List.Item>
              <Card
                variant="borderless"
                title={role.name.toUpperCase()}
                extra={
                  <a key="edit" onClick={() => handleEdit(role.name)}>
                    <EditOutlined style={{ marginRight: 4 }} /> Editar
                  </a>
                }
                headStyle={{
                  backgroundColor: '#0c2c60ff',
                  boxShadow: '0 4px 8px rgba(3, 3, 3, 0.1)',
                  fontStyle: 'normal',
                  fontWeight: 'lighter',
                  color: 'white',
                }}
              >
                Nombre del Rol: {role.name}<br/>
                Administrador: {role.is_admin? 'No' : 'Si'}
              </Card>
            </List.Item>
          )}
        />
      )}
      <Button type="primary" onClick={handleCreate}>
        Nuevo Rol
      </Button>
    </div>
  );
}
  
export default Role