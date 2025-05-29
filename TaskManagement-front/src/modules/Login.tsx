import { Button, Checkbox, Form, Input } from 'antd';
import AuthServices from '../routes/LoginRoute.tsx';
import { useAuth } from '../contexts/authContext.tsx'; 
import Password from 'antd/es/input/Password';

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
  };
  const Login = () => {
  const { login} = useAuth();  
  const handleLogin = async (values: FieldType) => {
    const { email, password } = values;
    if (!email || !password) return;

    try {
      const response = await AuthServices.logIn({ email, password });
      if (response && response.token && response.user) {
        login(response.token, response.user);
        // Aquí puedes redirigir o mostrar mensaje de éxito
      } else {
        // Maneja error de credenciales
        console.log('Credenciales incorrectas o error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error en la llamada al login:', error);
      // Muestra mensaje de error al usuario
    }
  };


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
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Por favor, ingresa tu email!' }]}
        >
          <Input />
        </Form.Item>
    
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Por favor, ingresa tu contraseña!' }]}
        >
          <Input.Password />
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