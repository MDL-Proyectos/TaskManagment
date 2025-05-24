import { useEffect, useState } from 'react'
import { TeamData } from '../components/Team';
import { useNavigate } from 'react-router-dom';
import TeamService from '../routes/TeamServices';
//import userService from '../../services/users'
import { Button, Card, List } from 'antd';

function Teams() {
  const [team, setTeam] = useState<TeamData[]>([]);
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

  // Función que se ejecutará al hacer clic en el botón
  const handleEdit = (idTeam: string) => {
    navigate(`/teams/${idTeam}`); // Redirige a la ruta de edición con el ID del usuario
  }; 

   const handleCreate = () => {
    navigate(`/teams/new`); // Redirige a la ruta de edición con el ID del usuario
  }; 

  return (
    <>
      <h2>Equipos!</h2>
        {team.length === 0 ? (
          <p>...</p>
          ) : (
          <List
            grid={{ gutter: 20, column: 2 }}
            dataSource={team}
            renderItem={(item) => (
              <List.Item
              actions={[
                <a key="edit" onClick={() => handleEdit(item.idTeam)}>Editar</a>,
              ]}>
                 <Card title={item.name.toUpperCase()}>
                  IdTeam: {item.idTeam},
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
    </>
  )
}
  
export default Teams