import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  Switch,
  message,
} from 'antd';
import RoleServices from '../../routes/RoleServices.tsx';
import userService from '../../routes/UserServices.tsx';

type SizeType = Parameters<typeof Form>[0]['size'];

const RoleForm: React.FC = () => {
  const { name } = useParams<{ name: string }>(); // ID desde la URL
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default'); //Antd
  const [isEditMode, setIsEditMode] = useState<boolean>(!!name); // Determina el modo (edición/creación)
  const [form] = Form.useForm(); // Instancia del formulario Antd
  const navigate = useNavigate();
  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  // Función para obtener los datos del usuario desde el backend
  const fetchRole = async () => {
    try {
      const response = await RoleServices.getRoleByName(name as string); // Llama al servicio para obtener los datos
      console.log('Datos del rol obtenidos:', response);
      const mappedData = {
        ...response
      };

      // Actualiza los campos del formulario con los datos recibidos
      form.setFieldsValue(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos del Rol:', error);
      message.error('Error al cargar los datos del Rol.');
    }
  };

  useEffect(() => {
   // if (isEditMode) {
      fetchRole(); // Carga los datos solo en modo edición
    //}
  }, [isEditMode, name]);

  // Función para validar si el nombre ya existe
const validaNombre = async (name: string): Promise<boolean> => {
    try {
      const existingRole = await RoleServices.getRoleByName(name);
      return !existingRole;
    } catch (error) {
      console.error('Error al validar el nombre del Rol:', error);
      // En caso de error en la validación, asumimos que el nombre no es válido
      return false;
    }
  };

    // Función para validar si el rol esta siendo utilizado
const validacionUsuarios = async (name: string): Promise<boolean> => {
  try {
    const userList = await userService.getUsers();
      // Busca si algún usuario tiene asignado el rol con el nombre proporcionado
      const isRoleUsed = userList.some((user: any) => user.role === name);

      return isRoleUsed; 
    } catch (error) {
      console.error('Error al validar el nombre del Rol:', error);
      return false;
    }
  };

   // Manejo del envío del formulario
   const handleFinish = async (values: any) => {
    try {
      console.log('Valores enviados:', values);

      if (isEditMode) {
        // Modo edición
        await RoleServices.updateRole(name as string, values);
        message.success('Rol actualizado correctamente');
      } else {
        // Modo creación
        const nombreValido = await validaNombre(values.name);

        if (nombreValido) {
          await RoleServices.createRole(values);
          message.success('Rol creado correctamente');
        } else {
          message.error('El Rol ya existe.');
          return; // Detenemos el flujo en caso de error
        }
      }

      // Redirige después de guardar
      navigate('/users/role');
    } catch (error) {
      console.error('Error al guardar el Rol:', error);
      message.error('No se pudo guardar el Rol.');
    }
  };

  const handleDelete = async (values: any) => {
  
    try {
      console.log('Valores enviados:', values);
  
      if (values) {
        const validoUso = await validacionUsuarios(values.name);
  
        if (!validoUso) {
          await RoleServices.deleteRole(values); 
          message.success('Rol eliminado correctamente');
        } else {
          console.error('El Rol esta siendo utilizado:', values.name);
          message.error('El Rol esta siendo utilizado.');
          return; // Detenemos el flujo en caso de error
        }
      }
  
      // Redirigir después de guardar
      navigate('/users/role');
    } catch (error) {
      console.error('Error eliminar el Rol:', error);
      message.error('No se pudo eliminar el Rol.');
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
     onFinish={handleFinish} // Maneja el envío del formulario
    >
      <Form.Item
        label="Titulo"
        name="name"
        rules={[{ required: true, message: 'Por favor, ingresa el nombre' }]}
      > 
        <Input placeholder="Nombre" disabled={false}/>
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
        {isEditMode ? 'Guardar Cambios' : 'Crear Rol'}
        </Button>
        <Button style={{ marginLeft: '10px' }} onClick={() => navigate('/users/role')}>
          Cancelar
        </Button>
        <Button type="default" style={{ marginLeft: '10px' }} onClick={() => handleDelete(name)}>
          Eliminar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
