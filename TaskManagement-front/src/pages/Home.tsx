
import React from 'react';
import { Card, Col, Row, Statistic, Alert, Typography, Skeleton, Divider } from 'antd';
import { useTaskStats } from '../hooks/useTaskStats';
import { HomeOutlined, CheckCircleOutlined, SettingOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';


const { Title } = Typography;

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color,onClick }) => (
  <Card 
    hoverable={true} 
    style={{ textAlign: 'center', borderColor: color, borderLeft: `5px solid ${color}` }}
    onClick={onClick}
  >
    <Statistic
      title={title}
      value={value}
      prefix={icon}
      valueStyle={{ color: color }}
    />
  </Card>
);

function Home(){
  const { stats, loading, error, isAdmin } = useTaskStats();
  const { user } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        {/*<Spin size="large" tip="Cargando estadísticas..." />*/}
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error al cargar el dashboard" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '20px', width: '100%', maxWidth: '1200px', height: '70%' }}>
      <Title level={2} >Hola, {user?.first_name}!</Title>
      <Title level={2} style={{ marginBottom: 30 }}>
        
      </Title>
<Divider orientation="horizontal">
  {isAdmin ? 'Resumen General de las Tareas' : 'Mi Resumen de Tareas'}
</Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Asignadas"
            value={stats.total}
            icon={<HomeOutlined />}
            color="#108ee9"
            onClick={() => navigate('/tasks')}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Nuevas / Pendientes"
            value={stats.Nuevo}
            icon={<ClockCircleOutlined />}
            color="#faad14" 
            onClick={() => navigate('/tasks', { state: { filterStatus: 'Nuevo' } })}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="En Progreso"
            value={stats['En Progreso']}
            icon={<SettingOutlined />}
            color="#52c41a" 
            onClick={() => navigate('/tasks', { state: { filterStatus: 'En Progreso' } })}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Completadas"
            value={stats.Completado}
            icon={<CheckCircleOutlined />}
            color="#00a854" 
            onClick={() => navigate('/tasks', { state: { filterStatus: 'Completado' } })}
          />
        </Col>
  
      </Row>
    
    </div>
  );
};

export default Home;