import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  Switch,
  message,
  Select
} from 'antd';
import TeamServices from '../../routes/TeamServices.tsx';
import { TeamData } from '../../entities/Team.tsx';
import TeamService from '../../routes/TeamServices.tsx';
import UserServices from '../../routes/UserServices.tsx';
import { UsuarioData } from '../../entities/User.tsx';

type SizeType = Parameters<typeof Form>[0]['size'];

const TeamForm = () => {
  const { idTeam } = useParams<{ idTeam: string }>(); // ID desde la URL
  const [isEditMode, setIsEditMode] = useState<boolean>(!!idTeam); // Determina el modo (edición/creación)
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
  const [form] = Form.useForm(); // Instancia del formulario
  const navigate = useNavigate();

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  const [users, setUsers] = useState<UsuarioData[]>([]); // Estado para almacenar la lista de usuarios

  // Función para obtener los datos del usuario desde el backend
  const fetchTeam = async () => {
    try {
      const response = await TeamServices.getTeamById(idTeam as string); // Llama al servicio para obtener los datos
      //console.log('Datos del equipo obtenidos:', response);
      console.log('Lider recibido: ', response.liderTeam);
      const mappedData = {
        ...response,
        liderTeam: response.liderTeam
        ? { _id: response.liderTeam } // Necesario para que coincida con el name del Form.Item
        : undefined,
    };
    console.log('Datos mapeados para el formulario:', mappedData);
      // Actualiza los campos del formulario con los datos recibidos
      form.setFieldsValue(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos del equipo:', error);
      message.error('Error al cargar los datos del equipo.');
    }
  };

  const fetchUsers = async () => {
    try {
      const listUsers = await UserServices.getUsers(); 
      const activeUsers = listUsers.filter(user => !user.is_deleted);
      const usersOfTeam = activeUsers.filter(user => user.team?.idTeam === idTeam);
      setUsers(usersOfTeam); 
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      message.error('Error al cargar la lista de usuarios.');
    }
  };

  // Ejecutar fetchTeam cuando el componente se carga
  useEffect(() => {
    fetchUsers();
    if (idTeam) {
        fetchTeam();
    }else{
      console.log('Modo creación de Team');
      setIsEditMode(false);
    }
  }, [idTeam, form]);

  // Función para manejar la actualización 
  const habldeFinish = async (values: TeamData) => {
    try {
      if (isEditMode) {
     // console.log('Valores enviados para actualizar:', values);
      await TeamService.updateTeam(idTeam as string, values); // Llama a tu endpoint de actualización
      message.success('Team actualizado correctamente');
      }else{
        await TeamService.createTeam(values); // Llama a tu endpoint de creación
        message.success('Team creado correctamente');
      }
      navigate('/teams'); 
    } catch (error) {
      console.error('Error al actualizar el Team:', error);
      message.error('No se pudo actualizar el Team.');
    }
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      onValuesChange={onFormLayoutChange}
      size={componentSize as SizeType}
      style={{ maxWidth: 600 }}
     onFinish={habldeFinish} // Maneja el envío del formulario
    >
      <Form.Item
        label="Identificación"
        name="idTeam"
        rules={[{ required: false, message: 'Por favor, ingresa el nombre' }]}
      >
        <Input
          placeholder="..."
          disabled={!!idTeam} // El campo estará deshabilitado si hay un idTeam
        />
      </Form.Item>
      <Form.Item
        label="Nombre"
        name="name"
        rules={[{ required: true, message: 'Por favor, ingresa un nombre al equipo' }]}
      >
        <Input placeholder="Nombre" />
      </Form.Item>
      <Form.Item
        label="Lider del Equipo"
        name={['liderTeam', '_id']}
        rules={[{ required: false, message: 'Por favor, selecciona un usuario' }]}
        >
        <Select placeholder="Selecciona un usuario">
            {users.map((user) => (
            <Select.Option key={user._id} value={user._id}>
                {user.first_name} {user.last_name}
            </Select.Option>
            ))}
        </Select>
    </Form.Item>  

    <Form.Item
        label="Activo"
        name="is_deleted"
        valuePropName="checked"
        getValueFromEvent={(checked) => !checked} // Invierte el valor al cambiar el switch
        getValueProps={(value) => ({ checked: !value })} // Invierte el valor al cargar
        >
        <Switch />
    </Form.Item>

      <Form.Item wrapperCol={{ span: 24 }}>
        <Button type="primary" htmlType="submit">
          Guardar Cambios
        </Button>
        <Button style={{ marginLeft: '10px' }} onClick={() => navigate('/')}>
          Cancelar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TeamForm;
