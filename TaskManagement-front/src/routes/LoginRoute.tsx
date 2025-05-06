import api from './ApiRoute';

interface dataLog {
    email: string;
    password: string; 
  }

  interface LoginResponse {
    token: string;
    user: any; // O un tipo más específico para tu objeto de usuario
  }

  const LoginRoute = {
    logIn: async (values: dataLog): Promise<LoginResponse> => { // Especifica el tipo de retorno de la promesa
      try {
        const response = await api.post(`/auth`, values);
        console.log('res: ', response.data); // Loguea response.data (lo que realmente devolvemos)
        return response.data; // Devuelve directamente response.data
      } catch (error) {
        console.error('Error al loguear:', error);
        throw error;
      }
    },
  };
export default LoginRoute;