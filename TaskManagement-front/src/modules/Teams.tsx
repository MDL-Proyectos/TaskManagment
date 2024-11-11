import { useEffect, useState } from 'react'
//import userService from '../../services/users'

function Teams() {
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
      <h1>Hola, Equipo!</h1>
      {apiInfo && (
        <h3>
          Hola a la Task-Managment!
        </h3>
      )}
    </>
  )
}

export default Teams