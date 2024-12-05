import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  Select,
  Switch,
  message,
} from 'antd';
import UserServices from '../../routes/UserServices.tsx';

type SizeType = Parameters<typeof Form>[0]['size'];

const UserForm: React.FC = () => {
  const { userid } = useParams<{ userid: string }>(); // ID del usuario desde la URL
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
  const [form] = Form.useForm(); // Instancia del formulario
  const navigate = useNavigate();

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
        team: response.team?.name || '', // Usamos el nombre del equipo
        role: response.role?.name || '', // Usamos el nombre del Rol
      };

      // Actualiza los campos del formulario con los datos recibidos
      form.setFieldsValue(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      message.error('Error al cargar los datos del usuario.');
    }
  };

  // Ejecutar fetchUsers cuando el componente se monta
  useEffect(() => {
    if (userid) {
      fetchUsers();
    }
  }, [userid, form]);

  // Función para manejar la actualización del usuario
 /* const handleUpdate = async (values: UsuarioData) => {
    try {
      console.log('Valores enviados para actualizar:', values);
      await UserServices.updateUser(userid as string, values); // Llama a tu endpoint de actualización
      message.success('Usuario actualizado correctamente');
      navigate('/'); // Redirige al listado de usuarios
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      message.error('No se pudo actualizar el usuario.');
    }
  };*/

  return (
    <Form
      form={form}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      onValuesChange={onFormLayoutChange}
      size={componentSize as SizeType}
      style={{ maxWidth: 600 }}
     // onFinish={handleUpdate} // Maneja el envío del formulario
    >
      <Form.Item
        label="Nombre"
        name="first_name"
        rules={[{ required: true, message: 'Por favor, ingresa el nombre' }]}
      > 
        <Input placeholder="Nombre del usuario" />
      </Form.Item>
      <Form.Item
        label="Apellido"
        name="last_name"
        rules={[{ required: true, message: 'Por favor, ingresa el apellido' }]}
      >
        <Input placeholder="Apellido del usuario" />
      </Form.Item>
      <Form.Item
        label="Team"
        name="team"
        rules={[{ required: false}]}
      >
        <Input placeholder="Team Asignado" />
      </Form.Item>

      <Form.Item
        label="Rol"
        name="role" // Debe coincidir con el campo en el objeto del backend
        rules={[{ required: true, message: 'Por favor, selecciona un rol' }]}
      >
        <Select>
          <Select.Option value="admin">Administrador</Select.Option>
          <Select.Option value="user">Usuario</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item 
        label="Notas"
        name="observations"
        rules={[{ required: false}]}
      >
        <Input placeholder="Notas personales.." disabled={true}/>
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: 'email', message: 'Por favor, ingresa un correo válido' }]}
      >
        <Input placeholder="Correo electrónico" />
      </Form.Item>
      
      <Form.Item
        label="Teléfono"
        name="phone"
        rules={[{ required: false}]}
      >
        <Input placeholder="Telefono / Celular" />
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

export default UserForm;
