import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/authContext';
//import userService from '../../services/users'

function Home() {
  
   const { user } = useAuth();
  //console.log('user:', user); 

  return (
    <>
      <h1>Bienvenido, {user?.first_name}</h1>

        <h3>Gestionemos tus tareas!</h3>
    </>
  )
}

export default Home