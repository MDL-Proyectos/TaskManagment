import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {Button,Form,Input,Switch,message} from 'antd';
import RoleServices from '../../services/RoleServices.tsx';
import userService from '../../services/UserServices.tsx';

const RoleForm = () => {
  const { name } = useParams<{ name: string }>(); // ID desde la URL
  const [isEditMode, setIsEditMode] = useState<boolean>(!!name);
  const [form] = Form.useForm(); 
  const navigate = useNavigate();

  const fetchRole = async () => {
    try {
      const response = await RoleServices.getRoleByName(name as string); 
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
      fetchRole(); 
  }, [isEditMode, name]);

  // Función para validar si el nombre ya existe
const validaNombre = async (name: string): Promise<boolean> => {
    try {
      const existingRole = await RoleServices.getRoleByName(name);
      return !existingRole;
    } catch (error) {
      console.error('Error al validar el nombre del Rol:', error);
      return false;
    }
  };

    // Función para validar si el rol esta siendo utilizado
const validacionUsuarios = async (): Promise<boolean> => {
  try {
    const userList = await userService.getUsers();
      // Busca si algún usuario tiene asignado el rol con el nombre
      const isRoleUsed = userList.some((user: any) => user.role?.name === name);
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
  
      if (values) {
        console.log('value ', values.name)
        const validoUso = await validacionUsuarios();
  
        if (!validoUso) {
          await RoleServices.deleteRole(values); 
          message.success('Rol eliminado correctamente');
        } else {
          console.error('El Rol esta siendo utilizado:', values.name);
          message.error('El Rol esta siendo utilizado.');
          return; // Detenemos el flujo en caso de error
        }
      }
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
        label="Administrador"
        name="is_admin"
        valuePropName="checked"
        getValueFromEvent={(checked) => !checked} // Invierte el valor al cambiar el switch
        getValueProps={(value) => ({ checked: !value })} // Invierte el valor al cargar
        >
        <Switch />
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
        <Button color="danger" variant="solid" style={{ marginRight: '10px' }} onClick={() => handleDelete(name)}>
          Eliminar
        </Button>        
        <Button type="primary" htmlType="submit">
        {isEditMode ? 'Guardar Cambios' : 'Crear Rol'}
        </Button>
        <Button style={{ marginLeft: '10px' }} onClick={() => navigate('/users/role')}>
          Cancelar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
