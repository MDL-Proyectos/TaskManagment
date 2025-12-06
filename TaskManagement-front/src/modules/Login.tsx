import { Button, Checkbox, Form, Input, message } from 'antd';
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
      //console.log('Respuesta del login:', response);
       login(response.token, response.user);
    } catch (error) {
      console.error('Error al loguear.');
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

/*        <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>*/