import { useEffect, useState } from 'react'
import Team, { TeamData } from '../entities/Team';
import { useNavigate } from 'react-router-dom';
import TeamService from '../routes/TeamServices';
//import userService from '../../services/users'
import { Button, Card, List } from 'antd';
import GlobalSearch from '../components/forms/GlobalSearch';
import { EditOutlined } from '@ant-design/icons';
import TeamModal from '../components/forms/TeamModal';

function Teams() {
  const [team, setTeam] = useState<TeamData[]>([]);
  const [searchText, setSearchText] = useState('');
// Estado para el ID del equipo que se está editando (null para crear)
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null); 
  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false); 
  // La navegación ya no se usa para editar/crear, pero se mantiene si es necesario para otras rutas
  const navigate = useNavigate(); 

  const fetchTeams = async () => {
    try {
      const data = await TeamService.getAllTeams(); // Llama directamente al método del servicio
     
      if (!Array.isArray(data)) {
        console.error('La respuesta de equipos no es un array:', data);
        return;
      }
      setTeam(data); // Actualiza el estado con los datos recibidos
      //console.log(await TeamService.getAllTeams());
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

   // Usar useEffect para ejecutar el fetch cuando el componente se carga
   useEffect(() => {
    fetchTeams(); // Llama a fetch cuando el componente se monta
  }, []); // El array vacío asegura que solo se ejecute una vez (al cargar)

         // Abrir el modal en modo edición
      const handleEdit = (idTeam: string) => {
        setEditingTeamId(idTeam);
        setIsModalOpen(true);
      }; 

      // Abrir el modal en modo creación
      const handleCreate = () => {
        setEditingTeamId(null); // ID nulo indica modo creación
        setIsModalOpen(true);
      };

      // Cerrar el modal y resetear el ID de edición
      const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingTeamId(null);
      };

      // Recargar datos después de guardar/eliminar exitosamente
      const handleSaveSuccess = () => {
        handleModalClose(); // Cierra el modal primero
        fetchTeams(); // Vuelve a cargar la lista
      };

      const handleGlobalSearch = (value: string) => {
        setSearchText(value.toLowerCase().trim()); 
      };

    const filteredTeams = team.filter(team => {
      // Si no hay texto de búsqueda, muestra todas las tareas
      if (!searchText) return true;

      const searchTerms = [
        team.liderTeam?.first_name,
        team.liderTeam?.last_name,
        team.name
      ].join(' ').toLowerCase(); // Unir todos los campos importantes en una sola cadena para buscar

      return searchTerms.includes(searchText);
    });

 
  return (
    <div style={{ width: '100%', maxWidth: '1200px', padding: '20px' }}>
      
      <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'flex-end'}}>
              <GlobalSearch 
                onSearch={handleGlobalSearch} 
                placeholder="Buscar por Nombre o Lider..."
              />
            </div>
            <h2 style={{marginBottom: 50}}>Equipos</h2>
        {team.length === 0 ? (
          <p>...</p>
          ) : (
          <List
            grid={{ gutter: 20, column: 4 }}
            dataSource={filteredTeams}
            renderItem={(item) => (
              <List.Item
              actions={[]}>
                 <Card variant="borderless" title={item.name.toUpperCase()}
                 extra={
                  <a key="edit" onClick={() => handleEdit(item.idTeam)}>
                    <EditOutlined style={{ marginRight: 4 }} /> Editar
                  </a>
                }
                 headStyle={{ 
                  backgroundColor: '#0c2c60ff', // Ejemplo: Un gris claro
                  boxShadow: '0 4px 8px rgba(3, 3, 3, 0.1)', // Opcional: Agregar sombra para que destaque
                  fontStyle: 'normal',
                  fontWeight: 'lighter',
                  color: 'white'

                }}>
                  Team: {item.idTeam},
                  Lider: {item.liderTeam?.first_name || "Sin Asignación"} {item.liderTeam?.last_name}
                  </Card>
              </List.Item>
            )}
          />
          )
        }
         <Button type="primary" onClick={handleCreate}>
        Nuevo
      </Button>
      <TeamModal
        open={isModalOpen}
        initialTeamId={editingTeamId} // Pasa el ID para modo edición (o null para creación)
        onClose={handleModalClose}
        onSaveSuccess={handleSaveSuccess} // Función para recargar la lista
      />
    </div>
  )
}
  
export default Teams