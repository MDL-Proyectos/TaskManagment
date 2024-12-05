import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  Switch,
  message,
} from 'antd';
import TeamServices from '../../routes/TeamServices.tsx';

type SizeType = Parameters<typeof Form>[0]['size'];

const TeamForm: React.FC = () => {
  const { idTeam } = useParams<{ idTeam: string }>(); // ID desde la URL
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
  const [form] = Form.useForm(); // Instancia del formulario
  const navigate = useNavigate();
    console.log('Ingresa 1')
  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  // Función para obtener los datos del usuario desde el backend
  const fetchTeam = async () => {
    try {
        console.log('ingresa 2')
      const response = await TeamServices.getTeamById(idTeam as string); // Llama al servicio para obtener los datos
      console.log('Datos del equipo obtenidos:', response);
      const mappedData = {
        ...response,
        liderTeam: response.liderTeam?.first_name || '' // Usamos el nombre del equipo       
      };

      // Actualiza los campos del formulario con los datos recibidos
      form.setFieldsValue(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos del equipo:', error);
      message.error('Error al cargar los datos del equipo.');
    }
  };

  // Ejecutar fetchTeam cuando el componente se monta
  useEffect(() => {
    if (idTeam) {
        fetchTeam();
        console.log(idTeam);
    }
  }, [idTeam, form]);

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
        label="Identificación"
        name="idTeam"
        rules={[{ required: true, message: 'Por favor, ingresa el nombre' }]}
      > 
        <Input placeholder="..." disabled={true}/>
      </Form.Item>
      <Form.Item
        label="Nombre"
        name="name"
        rules={[{ required: true, message: 'Por favor, ingresa un nombre al equipo' }]}
      >
        <Input placeholder="Nombre" />
      </Form.Item>
      <Form.Item
        label="Lider"
        name="liderTeam"
        rules={[{ required: false, message: 'Por favor, ingresa un usuario con rol de lider' }]}
      >
        <Input placeholder="Lider" />
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
