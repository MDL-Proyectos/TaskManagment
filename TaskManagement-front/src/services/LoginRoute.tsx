import api from './ApiRoute';

interface dataLog {
    email: string;
    password: string; 
  }

  interface LoginResponse {
    token: string;
    user: any;
  }

  const LoginRoute = {
    logIn: async (values: dataLog): Promise<LoginResponse> => { // Especifica el tipo de retorno de la promesa
      try {
        const response = await api.post(`/auth`, values);
    //   console.log('Respuesta del login:', response.data);
      if (response.status !== 201 && response.status !== 423 ) { //201 OK - 423 Bloqueado
        throw new Error('Error en la autenticación');
      }
        return response.data; // Devuelve directamente response.data
      } catch (error: any) {
        if (error.response.status === 401) {
           throw console.warn('Credenciales inválidas');
        }
        if (error.response.status === 423) {
           throw console.warn('Usuario Bloqueado.');
        } else {
         throw console.error('Error al loguear:', error);
        }
      
      }
    },

  };


export default LoginRoute;