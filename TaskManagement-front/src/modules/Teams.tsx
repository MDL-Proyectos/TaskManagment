import { useEffect, useState } from 'react'
import Team, { TeamData } from '../components/Team';
import { useNavigate } from 'react-router-dom';
import TeamService from '../routes/TeamServices';
//import userService from '../../services/users'

function Teams() {
  const [team, setTeam] = useState<TeamData[]>([]);
  const navigate = useNavigate();   

  const fetchTeams = async () => {
    try {
      const data = await TeamService.getAllTeams(); // Llama directamente al método del servicio
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
  const goToUsersPage = () => {
    navigate('/users')  // Redirige a la ruta '/users'
  }    

  return (
    <>
      <h1>Hola, Equipo!</h1>
      {team.length === 0 ? (
          <p>...</p>
        ) : (
          <>
            <ul>
              {team.map((t) => (           
                <Team key={t.idTeam} {...t} />
              ))}
            </ul>
            <p>Cantidad total de Tareas: {team.length}</p>
            <button onClick={goToUsersPage}>Nuevo Equipo</button>  
          </>
        )}
        </>
    )
  }

export default Teams