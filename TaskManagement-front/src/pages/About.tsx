import { Typography, Divider, Card, Row, Col, Tag, List } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  SafetyCertificateOutlined, 
  FileTextOutlined, 
  ProjectOutlined, 
  HomeOutlined 
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const About = () => {
  const modules = [
    {
      title: 'Home',
      icon: <HomeOutlined style={{ color: '#1890ff' }} />,
      description: 'Landing page principal con dashboard dinámico. Muestra datos estadísticos y resumen de tareas en tiempo real. Los Admin visualizan datos globales.',
      permiso: 'Todos los usuarios'
    },
    {
      title: 'Tareas',
      icon: <FileTextOutlined style={{ color: '#52c41a' }} />,
      description: 'Gestión del ciclo de vida de tareas. Permite creación, modificación y baja. Los lideres pueden crear y modificar tareas dentro de su equipo, mientras que los Admin tienen acceso total a todas las tareas.',
      permiso: 'Todos los usuarios'
    },
    {
      title: 'Proyectos',
      icon: <ProjectOutlined style={{ color: '#722ed1' }} />,
      description: 'Agrupación lógica de tareas por objetivos. Los Líderes solo pueden acceder a los datos de su Equipo, y los Admin tienen permisos para eliminar Proyectos.',
      permiso: 'Solo Líderes/Admin.'
    },
    {
      title: 'Usuarios',
      icon: <UserOutlined style={{ color: '#fa8c16' }} />,
      description: 'Administración de cuentas (ABM) y función crítica de reseteo de contraseñas. Los Líderes solo pueden acceder a los datos de su Equipo.',
      permiso: 'Solo Líderes/Admin.'
    },
    {
      title: 'Equipos',
      icon: <TeamOutlined style={{ color: '#eb2f96' }} />,
      description: 'Organización de colaboradores en células de trabajo con asignación de líderes.',
      permiso: 'Solo Administradores'
    },
    {
      title: 'Roles',
      icon: <SafetyCertificateOutlined style={{ color: '#f5222d' }} />,
      description: 'Definición de jerarquías y permisos de administración para el control de acceso.',
      permiso: 'Solo Administradores'
    },
  ];

  return (
    <div style={{ margin: '0 auto', paddingTop: '60px'}}>
      <header style={{ textAlign: 'center', marginBottom: '5px' }}>
        <Title level={2} style={{ color: '#32167d'}}>Sobre TaskManagement</Title>
        <Paragraph style={{ fontSize: '16px' }}>
          Una solución integral de gestión organizacional construida con 
          <Text code>Vite</Text>, <Text code>React</Text>, <Text code>Node.js</Text> y <Text code>MongoDB</Text>.
        </Paragraph>
      </header>

      <Divider orientation="horizontal">Módulos del Sistema</Divider>

      <Row gutter={[24, 24]}>
        {modules.map((item, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card 
              hoverable={false}
              style={{ height: '100%', borderRadius: '8px' }}
              title={<span>{item.icon} {item.title}</span>}
            >
              <Paragraph ellipsis={{ rows: 3 }}>
                {item.description}
              </Paragraph>
              <Tag color={item.permiso.includes('Solo') ? 'volcano' : 'green'}>
                {item.permiso}
              </Tag>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider orientation="horizontal" style={{ marginTop: '10px' }}>Seguridad y Tecnología</Divider>
      
      <Card style={{ background: '#f0f2f5', border: 'none' }}>
        <Row gutter={32}>
          <Col span={24}>
            <List
              itemLayout="horizontal"
              dataSource={[
                { t: 'Autenticación', d: 'Protección de rutas y sesiones mediante JSON Web Tokens (JWT).' },
                { t: 'Variables de Entorno', d: 'Configuración segura de API Keys y endpoints mediante archivos .env.' },
                { t: 'Gestión de Fechas', d: 'Sincronización horaria precisa utilizando DayJS.' }
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{item.t}</Text>}
                    description={item.d}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default About;