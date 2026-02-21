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
      description: 'Organización de colaboradores en células de trabajo con referencia de líderes.',
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
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '0 20px', 
      paddingTop: '0px' 
    }}>
      <header style={{ textAlign: 'center', marginBottom: '15px' }}>
        <Title level={2} style={{ color: '#32167d', marginBottom: '0px' }}>
          Sobre TaskManagement
        </Title>
        <Paragraph style={{ fontSize: '14px', marginTop: '20px' }}>
          Solución integral con <Text code>Vite</Text>, <Text code>React</Text>, <Text code>Node.js</Text> y <Text code>MongoDB</Text>.
        </Paragraph>
      </header>

      <Divider orientation="horizontal" style={{ margin: '15px 0' }}>Módulos del Sistema</Divider>

      <Row gutter={[16, 16]}> {/* Gutter para compactar */}
        {modules.map((item, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card 
              size="small"
              hoverable={false}
              style={{ height: '100%', borderRadius: '8px' }}
              title={<span style={{ fontSize: '14px' }}>{item.icon} {item.title}</span>}
            >
              <Paragraph style={{ fontSize: '13px', marginBottom: '10px' }}>
                {item.description}
              </Paragraph>
              <Tag color={item.permiso.includes('Solo') ? 'volcano' : 'green'} style={{ fontSize: '11px' }}>
                {item.permiso}
              </Tag>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider orientation="horizontal" style={{ margin: '20px 0 10px 0' }}>Seguridad y Tecnología</Divider>
      
      <Card size="small" style={{ background: '#f0f2f5', border: 'none' }}>
        <List
          size="small" 
          itemLayout="horizontal"
          dataSource={[
            { t: 'Autenticación', d: 'Protección mediante JWT.' },
            { t: 'Variables de Entorno', d: 'Configuración mediante .env.' },
            { t: 'Gestión de Fechas', d: 'Sincronización con DayJS.' }
          ]}
          renderItem={item => (
            <List.Item style={{ padding: '4px 0' }}> {/* Espacio entre items */}
              <List.Item.Meta
                title={<Text strong style={{ fontSize: '13px' }}>{item.t}</Text>}
                description={<span style={{ fontSize: '12px' }}>{item.d}</span>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default About;