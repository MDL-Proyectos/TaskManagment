import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, DatePicker, Form, Input, message, Select } from 'antd';
import TaskServices from '../../routes/TaskServices.tsx';
import dayjs from 'dayjs'; //esto me permite ajutar los formatos de fechas y corregirlos en el momento de visualizarlo

type SizeType = Parameters<typeof Form>[0]['size']; 

const TaskForm: React.FC = () => {
  const { idTask } = useParams<{ idTask: string }>(); // ID desde la URL
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  // Función para obtener los datos de la tarea desde el backend
  const fetchTask = async () => {
    try {
      const response = await TaskServices.getTaskById(idTask as string); // Llama al servicio para obtener los datos
      const mappedData = {
        ...response,
        created_at: response.created_at ? dayjs(response.created_at) : null,
        due_date: response.due_date ? dayjs(response.due_date) : null,
        completed_at: response.completed_at ? dayjs(response.completed_at) : null,
        comments: response.comments?.map((comment: any) => ({
          ...comment,
          created_at: comment.created_at ? dayjs(comment.created_at) : null,
        })),
      };

      // Actualiza los campos del formulario con los datos recibidos
      form.setFieldsValue(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos de la tarea:', error);
      message.error('Error al cargar los datos de la tarea.');
    }
  };

  // Ejecutar fetchTask cuando el componente carga
  useEffect(() => {
    if (idTask) {
      fetchTask();
    }
  }, [idTask, form]);

 
  const handleFinish = async (values: any) => {
    try {
      // Convierte las fechas a strings 
      const formattedValues = {
        ...values,
        created_at: values.created_at ? values.created_at.format('YYYY-MM-DD') : null, //el null es para evitar problemas si el registro no posee fecha
        due_date: values.due_date ? values.due_date.format('YYYY-MM-DD') : null,
        completed_at: values.completed_at ? values.completed_at.format('YYYY-MM-DD') : null,
        comments: values.comments?.map((comment: any) => ({
          ...comment,
          created_at: comment.created_at ? comment.created_at.format('YYYY-MM-DD') : null,
        })),
      };

      console.log('Datos enviados:', formattedValues);

      // Aquí puedes llamar al servicio de actualización
      // await TaskServices.updateTask(idTask, formattedValues);

      message.success('Tarea actualizada correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      message.error('No se pudo actualizar la tarea.');
    }
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      onValuesChange={onFormLayoutChange}
      onFinish={handleFinish}
      size={componentSize as SizeType}
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        label="Titulo"
        name="title"
        rules={[{ required: true, message: 'Por favor, ingresa el título' }]}
      >
        <Input placeholder="Título" />
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: 'Por favor, selecciona un estado' }]}
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
        rules={[{ required: true, message: 'Por favor, selecciona la fecha de creación' }]}
      >
        <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Fecha de Vencimiento"
        name="due_date"
        rules={[{ required: true, message: 'Por favor, selecciona la fecha de vencimiento' }]}
      >
        <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Fecha de Finalización"
        name="completed_at"
      >
        <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Proyecto"
        name="project"
        rules={[{ required: true, message: 'Por favor, ingresa el proyecto' }]}
      >
        <Input placeholder="Proyecto" />
      </Form.Item>

      <Form.Item
        label="Observaciones"
        name="observations"
      >
        <Input.TextArea placeholder="Observaciones" />
      </Form.Item>

      <Form.List name="comments">
        {(fields, { add, remove }) => (
          <div>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ marginBottom: '20px' }}>
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
                  <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
                </Form.Item>

                <Button type="link" danger onClick={() => remove(name)}>
                  Eliminar Comentario
                </Button>
              </div>
            ))}

            <Form.Item>
              <Button style={{ marginLeft: '55px' }} type="dashed" onClick={() => add()} block>
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
