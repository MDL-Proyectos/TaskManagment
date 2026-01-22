import React from 'react';
import { Form, Input, Button, Typography, Card, Row, Col } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import fondoImg from '../assets/fondo1.jpg';
const { Title, Text } = Typography;
import { useAuth } from '../contexts/authContext.tsx'; 
import AuthServices from '../routes/LoginRoute.tsx';
import '../App.css';

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
    <div className="login-container">
      <Card className="login-card" bodyStyle={{ padding: 0 }} bordered={false}>
        <Row style={{ height: '100%' }}>
          {/* LADO IZQUIERDO: FORMULARIO */}
          <Col xs={24} md={12} className="form-section">
            <div className="form-wrapper">
              <Title level={2} className="login-title">Buen día!</Title>
              <Text type="secondary" className="login-subtitle">
                Por favor, ingresá tu mail y contraseña para iniciar sesión.
              </Text>

              <Form
                layout="vertical"
                onFinish={handleLogin}
                style={{ marginTop: 40 }}
              >
                <Form.Item name="email"
                rules={[{ required: true, message: 'Por favor, ingresa tu email' }]}>
                  <Input 
                    placeholder="Email" 
                    required={true}
                    className="login-input" 
                  />
                </Form.Item>

                <Form.Item name="password" 
                rules={[{ required: true, message: 'Por favor, ingresa tu contraseña' }]}>
                  <Input.Password
                    placeholder="Password"
                    className="login-input"
                    required={true}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <div style={{ textAlign: 'right', marginBottom: 24 }}>

                </div>

                <Form.Item>
                  <Button type="primary" htmlType="submit" className="sign-in-button" block>
                    Ingresar
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
          {/* LADO DERECHO: IMAGEN DE FONDO Y TEXTO */}
          <Col xs={0} md={10} className="image-section" 
               style={{ backgroundImage: 'url(' + fondoImg + ')' }}>
           <div className="overlay-content">
            <Title 
              level={1} 
              style={{ 
                color: '#dee5eb', 
                fontWeight: 300,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                padding: '20px',
                borderRadius: '15px',
                display: 'inline-block' // Para que el fondo no ocupe todo
              }}
            >
              Tu trabajo, centralizado.
            </Title>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Login;