import { useState } from 'react'
import { Button, Checkbox, Form, Input } from 'antd';
import AuthServices from '../routes/LoginRoute.tsx';
import { useAuth } from '../contexts/authContext.tsx'; // Importa el hook useAuth

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
  };

  const Login = (props: { login: (arg0: string) => void }) => {
    const [email, setUser] = useState('');
    const [password, setPassword] = useState('');
    const { setToken, setUser: setAuthUser } = useAuth();
  
    async function doLogin() {
      let data = {
        email: email,
        password: password,
      };
      console.log('Datos a enviar al backend:', data);
      try {
        const response = await AuthServices.logIn(data);
        console.log('res: ', response)
        return response; // Ahora 'response' será lo que devuelve AuthServices.logIn (response.data)
      } catch (error) {
        console.error('Error en doLogin:', error);
        throw error; // Re-lanza el error para que lo capture el .catch en handleLogin
      }
    }
  
    function handleLogin() {
      console.log('Ingresa a handleLogin');
      doLogin()
        .then((data) => { // 'response' de doLogin ahora es 'data'
         // console.log('Respuesta del login:', data);
          if (data && data.token) { // Ejemplo: verifica si la respuesta tiene un token
            console.log('Login exitoso! Token:', data.token);
            setToken(data.token); // Almacena el token en el contexto
            setAuthUser(data.user); // Almacena la información del usuario en el contexto (opcional)
            props.login('ok'); // Notifica al padre
            // Redirige al usuario, etc.
          } else {
            console.log('Credenciales incorrectas o error en la respuesta del servidor');
            // Aquí deberías mostrar un mensaje de error al usuario
          }
        })
        .catch((error) => {
          console.error('Error en la llamada al login:', error);
          // Aquí deberías mostrar un mensaje de error al usuario
        });
    }

    function handleUser(e: any) {
        setUser(e.target.value)

    }

    function handlePass(e: any) {
        setPassword(e.target.value)
    }

    return (
        <div 
        className="login-container" >

            <div className="login-form-wrapper">
        <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, backgroundColor: 'transparent' }}
        initialValues={{ remember: true }}
        onFinish={handleLogin}
       // onFinishFailed={handleUser}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="email"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input onChange={(e) => handleUser(e)} />
        </Form.Item>
    
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!'}]}
         
        >
          <Input.Password onChange={(e) => handlePass(e)}/>
        </Form.Item>
    
        <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
    
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      </div>
</div>
    );
};

export default Login;