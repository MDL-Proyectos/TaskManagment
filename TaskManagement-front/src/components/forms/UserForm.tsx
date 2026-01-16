import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  Select,
  Switch,
  message,
  Row,
  Col
} from 'antd';
import UserServices from '../../routes/UserServices.tsx';
//import RoleService from '../../routes/RoleServices.tsx';
import { RoleData } from '../../entities/Role.tsx';
import TeamService from '../../routes/TeamServices.tsx';
import RoleServices from '../../routes/RoleServices.tsx';
import { TeamData } from '../../entities/Team.tsx';

type SizeType = Parameters<typeof Form>[0]['size'];

const UserForm = () => {
  const { userid } = useParams<{ userid: string }>(); // ID del usuario desde la URL
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
  const [form] = Form.useForm(); // Instancia del formulario
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RoleData[]>([]); // Estado para almacenar la listlista de usuarios
  const [teams, setTeams] = useState<TeamData[]>([]); // Estado para almacenar la lista de equipos

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  // Función para obtener los datos del usuario desde el backend
  const fetchUsers = async () => {
    try {
      const response = await UserServices.getUserById(userid as string); // Llama al servicio para obtener los datos
      console.log('Datos del usuario obtenidos:', response);
      const mappedData = {
        ...response,
        team: response.team?.idTeam || '', // Usamos el nombre del equipo
        role: response.role?.name || '', // Usamos el nombre del Rol
      };

      // Actualiza los campos del formulario con los datos recibidos
      form.setFieldsValue(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      message.error('Error al cargar los datos del usuario.');
    }
  };

  // Función para obtener los datos de los Roles
  const fetchRoles = async () => {
    try {
      const listRoles = await RoleServices.getAllRole(); 
      setRoles(listRoles); 
    } catch (error) {
      console.error('Error al obtener la lista de roles:', error);
      message.error('Error al cargar la lista de roles.');
    }
  };

   // Función para obtener los datos de los equipos
   const fetchTeams = async () => {
    try {
      const listTeams = await TeamService.getAllTeams(); 
      const activeTeams = listTeams.filter(team => !team.is_deleted);
      setTeams(activeTeams); 
    } catch (error) {
      console.error('Error al obtener la lista de equipos:', error);
      message.error('Error al cargar la lista de equipos.');
    }
  };

  // Ejecutar fetchUsers cuando el componente se carga
  useEffect(() => {
    fetchRoles();
    fetchTeams();
    if (userid) {
      fetchUsers();
    }
  }, [userid, form]);


   // Manejo de creación o edición
   const handleFinish = async (values: any) => {
    try {
      console.log('Valores enviados:', values);
      if (userid) {
        // Editar usuario
        await UserServices.updateUser(userid, values);
        message.success('Usuario actualizado correctamente');
        navigate('/users'); // Redirigir 
      } else {
        // Crear usuario
        const isNew = await UserServices.getUsers();
        const existingUser = isNew.find(user => user.email === values.email);
        if(!existingUser) {
          await UserServices.createUser(values); // Llama al endpoint de creación
          message.success('Usuario creado correctamente');
          return navigate('/users'); // Redirigir
        }
        message.error('El correo ya se encuentra registrado.');        
      }
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      message.error('No se pudo guardar el usuario.');
    }
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
      layout="vertical"
      size={componentSize as SizeType}
      style={{ maxWidth: 1000 }}
     onFinish={handleFinish} // Maneja el envío del formulario
     
    >
        <Row gutter={16}>
    <Col span={12}>
      <Form.Item
        label="Nombre"
        name="first_name"
        rules={[{ required: true, message: 'Por favor, ingresa el nombre' }]}
      > 
        <Input placeholder="Nombre del usuario" />
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
        label="Apellido"
        name="last_name"
        rules={[{ required: true, message: 'Por favor, ingresa el apellido' }]}
      >
        <Input placeholder="Apellido del usuario" />
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
        label="Team"
        name="team"
        rules={[{ required: false}]}
      >
        <Select placeholder="Selecciona un Equipo">
            {teams.map((team) => (
            <Select.Option key={team.idTeam} value={team.idTeam} >
                {team.name} 
            </Select.Option>
            ))}
        </Select>
      </Form.Item>
      </Col>
      <Col span={12}>

      <Form.Item
        label="Rol"
        name="role" // Debe coincidir con el campo en el objeto del backend
        rules={[{ required: true, message: 'Por favor, selecciona un rol' }]}
      >
        <Select placeholder="Selecciona un Equipo">
            {roles.map((rol) => (
            <Select.Option key={rol.name} value={rol.name}>
                {rol.name} 
            </Select.Option>
            ))}
        </Select>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item 
        label="Notas"
        name="observations"
        rules={[{ required: false}]}
      >
       <Input
        placeholder="Notas personales..."
        disabled={false} 
      />
      </Form.Item>

      <Form.Item 
        label="Password"
        name="password"
        hidden={true}
        rules={[
          { required: false, message: 'Por favor, ingresa un código' },
          { pattern: /^[\w\s@#$%^&*()_+=-]+$/, message: 'El código debe tener 6 dígitos' },
        ]}
      >
       <Input.Password
        placeholder="Password"      
      />
      </Form.Item>
        </Col>
      <Col span={12}>
      <Form.Item
        label="Email"
        name="email"
        style={{width: '100%'}}
        rules={[{ required: true, type: 'email', message: 'Por favor, ingresa un correo válido' }]}
      >
        <Input placeholder="Correo electrónico" />
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
        label="Teléfono"
        name="phone"
        rules={[{ required: false}]}
      >
        <Input placeholder="Telefono / Celular" />
      </Form.Item>
        </Col>
      <Col span={12}>
    <Form.Item
        label="Activo"
        name="is_deleted"
        valuePropName="checked"
        
        getValueFromEvent={(checked) => !checked} // Invierte el valor al cambiar el switch
        getValueProps={(value) => ({ checked: !value })} // Invierte el valor al cargar
        >
        <Switch />
    </Form.Item>
    <Form.Item
        label="Team Lider"
        name="is_leader"
        valuePropName="checked"
        
        getValueFromEvent={(checked) => checked} // Invierte el valor al cambiar el switch
        getValueProps={(value) => ({ checked: value })} // Invierte el valor al cargar
        >
        <Switch />
    </Form.Item>
        </Col>  
      <Col span={12} style={{ display: 'flex', justifyContent: 'right', marginTop: '20px' }}>
        <Button type="primary" htmlType="submit">
          Guardar Cambios
        </Button>
        <Button style={{ marginLeft: '10px' }} onClick={() => navigate('/users')}>
          Cancelar
        </Button>
      </Col>
      </Row>
    </Form>
  );
};

export default UserForm;
