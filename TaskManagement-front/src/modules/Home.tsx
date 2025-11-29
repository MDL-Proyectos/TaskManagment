import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/authContext';
//import userService from '../../services/users'

function Home() {
  
   const { user } = useAuth();
  //console.log('user:', user); 

  return (
    <>
      <h1>Hola, {user?.first_name}!</h1>

        <h3>Gestioná tus tareas de manera fácil y práctica.</h3>
    </>
  )
}

export default Home