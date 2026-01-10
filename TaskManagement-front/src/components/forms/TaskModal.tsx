import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, DatePicker, message, Select } from 'antd';
import TaskServices from '../../routes/TaskServices';
import dayjs from 'dayjs';
import { UsuarioData } from '../../entities/User';
import { TeamData } from '../../entities/Team';
import UserServices from '../../routes/UserServices';
import TeamService from '../../routes/TeamServices';

interface TaskModalProps {
  visible: boolean;
  idTask?: string | null; // <-- así acepta string o null
  onClose: () => void;
  onSuccess?: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  idTask,
  onClose,
  onSuccess,
}) => {
//const { idTask } = useParams<{ idTask: string }>(); 
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [users, setUsers] = useState<UsuarioData[]>([]); // Estado para almacenar la lista de usuarios
 const [teams, setTeams] = useState<TeamData[]>([]); // Estado para almacenar la lista de equipos

  // Cargar datos si es edición
  const fetchTask = async () => {
    try {
    
      const response = await TaskServices.getTaskById(idTask as string); 
      const mappedData = {
        ...response,
        description: response.description || '', // Asegurar que description tenga un valor predeterminado
        created_at: response.created_at ? dayjs(response.created_at) : null,
        due_date: response.due_date ? dayjs(response.due_date) : null,
        completed_at: response.completed_at ? dayjs(response.completed_at) : null,
        comments: response.comments?.map((comment: any) => ({
          ...comment,
          created_at: comment.created_at ? dayjs(comment.created_at) : null,
        })),
      };
      // Verificar los valores mapeados
      console.log('Datos mapeados para el formulario:', mappedData);
      // Actualiza los campos del formulario con los datos recibidos
      form.setFieldsValue(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos de la tarea:', error);
      message.error('Error al cargar los datos de la tarea.');
    }
  };
    // Función para obtener los datos de los usuarios
        const fetchUsers = async () => {
          try {
            const listUsers = await UserServices.getUsers(); 
            const activeUsers = listUsers.filter(user => !user.is_deleted);
            setUsers(activeUsers); 
          } catch (error) {
            console.error('Error al obtener la lista de usuarios:', error);
            message.error('Error al cargar la lista de usuarios.');
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

          useEffect(() => {
            fetchUsers();
            fetchTeams();
            
            if (idTask) {
              // MODO EDITAR: Cargar datos
              fetchTask();
            } else {
              form.resetFields(); 
            }
          }, [idTask, form]);

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      
      if (idTask) {
        await TaskServices.updateTask(idTask, values);
        message.success('Tarea actualizada');
      } else {
        await TaskServices.createTask(values);
        message.success('Tarea creada');
      }
      setConfirmLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      setConfirmLoading(false);
      message.error('Error al guardar la tarea');
    }

  };

  return (
    <Modal
      title={idTask ? 'Editar Tarea' : 'Nueva Tarea'}
      open={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Título"
          name="title"
          rules={[{ required: true, message: 'Por favor, ingresa el título' }]}
        >
          <Input />
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
          label="Prioridad"
          name="priorityLevel"
          rules={[{ required: true, message: 'Por favor, selecciona una prioridad' }]}
          
        >
          <Select>
            <Select.Option value="Baja">Baja</Select.Option>
            <Select.Option value="Media">Media</Select.Option>
            <Select.Option value="Alta">Alta</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ required: true, message: 'Por favor, ingresa la descripción' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Fecha de creación"
          name="created_at"
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
        <DatePicker 
        format="DD-MM-YYYY" 
      />
      </Form.Item>

      <Form.Item
        label="Usuario Asignado"
        name={['assigned_user', '_id']}
        rules={[{ required: true, message: 'Por favor, selecciona un usuario' }]}
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
        label="Equipo"
        name={['assigned_team', 'idTeam']}
        rules={[{ required: true, message: 'Por favor, selecciona un Equipo' }]}
        >
        <Select placeholder="Selecciona un Equipo">
            {teams.map((team) => (
            <Select.Option key={team.idTeam} value={team.idTeam}>
                {team.name} 
            </Select.Option>
            ))}
        </Select>
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
      <Form.Item
        label="Autorizó"
        name={['authorized_by', '_id']}
        rules={[{ required: true, message: 'Por favor, selecciona un usuario' }]}
        >
        <Select placeholder="Selecciona un usuario">
            {users.map((user) => (
            <Select.Option key={user._id} value={user._id}>
                {user.first_name} {user.last_name}
            </Select.Option>
            ))}
        </Select>
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
                <Form.Item
                  {...restField}
                  label="Autor"
                  name={[name, 'author']}
                  
                >
                  <Select placeholder="Selecciona un autor">
                    {users.map((user) => (
                      <Select.Option key={user._id} value={user._id}>
                        {user.first_name} {user.last_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button type="link" danger onClick={() => remove(name)}>
                  Eliminar Comentario
                </Button>
              </div>
            ))}

            <Form.Item>
              <Button style={{ marginLeft: '1px' }} type="dashed" onClick={() => add()} block>
                Agregar Comentario
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
      </Form>
    </Modal>
  );
};

export default TaskModal;