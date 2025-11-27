import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  message,
} from 'antd';
import UserServices from '../../routes/UserServices.tsx';

type SizeType = Parameters<typeof Form>[0]['size'];

const UserPassForm = () => {
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
          const newUser = localStorage.getItem('newUser');
     const userId = newUser ? JSON.parse(newUser)._id : null;
      const response = await UserServices.getUserById(userId as string); // Llama al servicio para obtener los datos
      console.log('Datos del usuario obtenidos:', response);
      const mappedData = {
        ...response
      };

      // Actualiza los campos del formulario con los datos recibidos
      form.setFieldsValue(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      message.error('Error al cargar los datos del usuario.');
    }
  };

  // Ejecutar fetchUsers cuando el componente se carga
  useEffect(() => {
    const newUser = localStorage.getItem('newUser');
    const userId = newUser ? JSON.parse(newUser)._id : null;

    if(userId){  
      fetchUsers();
    }    
  }, [userid, form]);


   // Manejo de creación o edición
   const handleFinish = async (values: any) => {
    try {
      console.log('Valores enviados:', values);
      if (!values){
         message.error('Por favor, ingresa tu contraseña actual.');     
      }

      //valido contraseña actual
      const isValid = await UserServices.validatePassword(values.currentPassword);
      if (!isValid) {
        message.error('La contraseña actual no es válida.');
        return;
      }  
      if (userid) {
        // Editar usuario
        await UserServices.updateUser(userid, values);
        message.success('Contraseña actualizada');
        navigate('/users'); // Redirigir 
      } else {

        message.error('No se puede actualizar la contraseña.');        
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
      layout="horizontal"
      onValuesChange={onFormLayoutChange}
      size={componentSize as SizeType}
      style={{ maxWidth: 600 }}
     onFinish={handleFinish} // Maneja el envío del formulario
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
        label="Password Actual"
        name="password"
        rules={[
          { required: true, message: 'Por favor, ingresa un código' },
          { pattern: /^[\w\s@#$%^&*()_+=-]+$/, message: 'El código debe tener 6 dígitos' },
        ]}
      >
       <Input.Password
        placeholder="Password"
        //disabled={!!userid} // Habilitado solo si no hay idUser
      />
      </Form.Item>

      <Form.Item 
        label="Password Nueva"
        name="password"
        rules={[
          { required: true, message: 'Por favor, ingresa un código' },
          { pattern: /^[\w\s@#$%^&*()_+=-]+$/, message: 'El código debe tener 6 dígitos' },
        ]}
      >
       <Input.Password
        placeholder="Password"
        //disabled={!!userid} // Habilitado solo si no hay idUser
      />
      </Form.Item>      



      <Form.Item wrapperCol={{ span: 24 }}>
        <Button type="primary" htmlType="submit">
          Guardar Cambios
        </Button>
        <Button style={{ marginLeft: '10px' }} onClick={() => navigate('/users')}>
          Cancelar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserPassForm;
