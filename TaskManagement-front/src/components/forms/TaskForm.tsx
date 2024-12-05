import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  message,
  Select
} from 'antd';
import TaskServices from '../../routes/TaskServices.tsx';

type SizeType = Parameters<typeof Form>[0]['size'];

const TaskForm: React.FC = () => {
  const { idTask } = useParams<{ idTask: string }>(); // ID desde la URL
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
  const [form] = Form.useForm(); // Instancia del formulario
  const navigate = useNavigate();
    console.log('Ingresa 1')
  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  // Función para obtener los datos del usuario desde el backend
  const fetchTask = async () => {
    try {
        console.log('ingresa 2')
      const response = await TaskServices.getTaskById(idTask as string); // Llama al servicio para obtener los datos
      console.log('Datos del equipo obtenidos:', response);
      const mappedData = {
        ...response,
        assigned_team: response.assigned_team?.name || '', 
        assigned_user: response.assigned_user?.first_name || '',
        authorized_by: response.authorized_by?.first_name || '',

      };

      // Actualiza los campos del formulario con los datos recibidos
      form.setFieldsValue(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos de la tarea:', error);
      message.error('Error al cargar los datos de la tarea.');
    }
  };

  // Ejecutar fetchTeam cuando el componente se monta
  useEffect(() => {
    if (idTask) {
        fetchTask();
        console.log(idTask);
    }
  }, [idTask, form]);

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
        label="Titulo"
        name="title"
        rules={[{ required: true, message: 'Por favor, ingresa el titulo' }]}
      > 
        <Input placeholder="Titulo" disabled={false}/>
      </Form.Item>
      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: 'Por favor, ingresa un status' }]}
      >
        <Select>
          <Select.Option value="Nuevo">Nuevo</Select.Option>
          <Select.Option value="En Progreso">En Progreso</Select.Option>
          <Select.Option value="Completado">Completado</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Fecha de Creación"
        name="created_at"
        rules={[{ required: true }]}
      >
        <Input placeholder="Lider" />
      </Form.Item>

      <Form.Item
        label="Fecha de Vencimiento"
        name="due_date"
        rules={[{ required: false, message: 'Por favor, ingresa el vencimiento' }]}
      >
        <Input placeholder="Vencimiento" />
      </Form.Item>

      <Form.Item
        label="Fecha de Finalización"
        name="completed_at"
        rules={[{ required: false, message: 'Por favor, ingresa la finalización' }]}
      >
        <Input placeholder="Finalización" />
      </Form.Item>

      <Form.Item
        label="Proyecto"
        name="project"
        rules={[{ required: false, message: 'Por favor, ingresa el Proyecto' }]}
      >
        <Input placeholder="Proyecto" />
      </Form.Item>

      <Form.Item
        label="Observaciones"
        name="observations"
        rules={[{ required: false }]}
      >
        <Input placeholder="Observaciones" />
      </Form.Item>

      <Form.List name="comments">
  {(fields, { add, remove }) => (
    <div>
      <h3>Comentarios</h3>
      {fields.map(({ key, name, ...restField }) => (
        <div key={key} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          <Form.Item
            {...restField}
            label="Autor"
            name={[name, 'author', '_id']}
            rules={[{ required: true, message: 'Por favor, ingresa el autor' }]}
          >
            <Input placeholder="ID del autor" />
          </Form.Item>
          <Form.Item
            {...restField}
            label="Nombre del autor"
            name={[name, 'author', 'first_name']}
            rules={[{ required: true, message: 'Por favor, ingresa el nombre del autor' }]}
          >
            <Input placeholder="Nombre del autor" />
          </Form.Item>
          <Form.Item
            {...restField}
            label="Apellido del autor"
            name={[name, 'author', 'last_name']}
            rules={[{ required: true, message: 'Por favor, ingresa el apellido del autor' }]}
          >
            <Input placeholder="Apellido del autor" />
          </Form.Item>
          <Form.Item
            {...restField}
            label="Mensaje"
            name={[name, 'message']}
            rules={[{ required: true, message: 'Por favor, ingresa el mensaje' }]}
          >
            <Input.TextArea placeholder="Mensaje del comentario" />
          </Form.Item>
          <Form.Item
            {...restField}
            label="Fecha de Creación"
            name={[name, 'created_at']}
          >
            <Input placeholder="Fecha de creación" />
          </Form.Item>
          <Button type="link" danger onClick={() => remove(name)}>
            Eliminar Comentario
          </Button>
        </div>
      ))}
      <Form.Item>
        <Button style={{ marginLeft:'60px' }} type="dashed" onClick={() => add()} block>
          Agregar Comentario
        </Button>
      </Form.Item>
    </div>
  )}
</Form.List>


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

export default TaskForm;
