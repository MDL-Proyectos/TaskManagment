import { useEffect, useState } from 'react'
//import userService from '../../services/users'

function Home() {
  const [apiInfo, setApiInfo] = useState({})
  useEffect(() => {
    /*const fetchData = async () => {
      const response = await userService.getRoot()
      setApiInfo(response)
    }
    fetchData()*/
  }, [])

  return (
    <>
      <h1>Bienvenido, Usuario</h1>
      {apiInfo && (
        <h3>
          Gestionemos tus tareas!
        </h3>
      )}
    </>
  )
}

export default Home