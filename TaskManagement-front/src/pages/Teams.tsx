import { useEffect, useState } from 'react'
import { TeamData } from '../entities/Team';
import TeamService from '../routes/TeamServices';
import { Button, Card, List, Typography } from 'antd';
import GlobalSearch from '../components/forms/GlobalSearch';
import { EditOutlined } from '@ant-design/icons';
import TeamModal from '../components/forms/TeamModal';
const { Title } = Typography;

function Teams() {
  const [team, setTeam] = useState<TeamData[]>([]);
  const [searchText, setSearchText] = useState('');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null); 
  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const fetchTeams = async () => {
    try {
      const data = await TeamService.getAllTeams(); // Llama directamente al método del servicio
     
      if (!Array.isArray(data)) {
        console.error('La respuesta de equipos no es un array:', data);
        return;
      }
      setTeam(data); 
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

   useEffect(() => {
    fetchTeams(); // Llama a fetch cuando el componente se monta
  }, []); 

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
    <div style={{  width: '100%', height: '100%', padding: '60px', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
        {/* <Title level={2} style={{ marginBottom: 50 }}>
            Equipos
         </Title>*/}
         <div style={{ width: '80%', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>   
            <Button type="primary" onClick={handleCreate}>
              Nuevo
            </Button>      
                <GlobalSearch 
                  onSearch={handleGlobalSearch} 
                  placeholder="Buscar por Nombre o Lider..."
                />    
          </div>
        {filteredTeams.length === 0 ? (
          <p>No existen Equipos</p>
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
                  backgroundColor: '#0c2c60ff', 
                  boxShadow: '0 4px 8px rgba(3, 3, 3, 0.1)', 
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
      <TeamModal
        open={isModalOpen}
        initialTeamId={editingTeamId} 
        onClose={handleModalClose}
        onSaveSuccess={handleSaveSuccess} 
      />
    </div>
  )
}
  
export default Teams