import React, { useState, useEffect } from 'react';
import { Button, Form, Input, DatePicker, message, Select, Col, Row, Divider } from 'antd';
import TaskServices from '../../services/TaskServices';
import dayjs from 'dayjs';
import { UsuarioData } from '../../entities/User';
import { TeamData } from '../../entities/Team';
import UserServices from '../../services/UserServices';
import TeamService from '../../services/TeamServices';
import ProjectServices from '../../services/ProjectServices';
import { TaskProjectData } from '../../entities/TaskProject';
import useAuth from '../../hooks/useAuth';
import GenericModal from './GenericModal';

interface TaskModalProps {
  visible: boolean;
  idTask?: string | null; 
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
  const [projects, setProjects] = useState<TaskProjectData[]>([]); // Estado para almacenar la lista de proyectos
  const { user: currentUser } = useAuth();
  
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

        const fectchProjects = async () => {
          try {
            const listProjects = await ProjectServices.getAllProjects();  
            const activeProjects = listProjects.filter(project => project.status == 'Abierto');
            
            setProjects(activeProjects); 
          } catch (error) {
            console.error('Error al obtener la lista de proyectos:', error);
            message.error('Error al cargar la lista de proyectos.');
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
            if(visible){
            fetchUsers();
            fetchTeams();
            fectchProjects();

            if (idTask) {
              // MODO EDITAR: Cargar datos
              fetchTask();
            } else {
              form.resetFields(); 
            }
          }else{
            form.resetFields(); 
          }
          }, [idTask, form, visible]);

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      if (idTask) {
        await TaskServices.updateTask(idTask, values);
        console.log("Valores enviados:", values);
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
    <GenericModal
      title={idTask ? 'Editar Tarea' : 'Nueva Tarea'}
      open={visible}
      onSubmit={handleOk}
      confirmLoading={confirmLoading}
      isEditing={!!idTask}
      onClose={onClose} 
      form={form}
    >
        <Row gutter={[24, 0]}>
          
          {/* COLUMNA COMPLETA: Título */}
          <Col span={24}>
            <Form.Item
              label="Título de la Tarea"
              name="title"
              rules={[{ required: true, message: 'Por favor, ingresa el título' }]}
            >
              <Input placeholder="Ej: Actualizar base de datos" />
            </Form.Item>
          </Col>

          {/* COLUMNA IZQUIERDA */}
          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              initialValue={"Nuevo"}
              rules={[{ required: true, message: 'Selecciona un estado' }]}
            >
              <Select>
                <Select.Option value="Nuevo">Nuevo</Select.Option>
                <Select.Option value="En Progreso">En Progreso</Select.Option>
                <Select.Option value="Completado">Completado</Select.Option>
                <Select.Option value="Cancelado">Cancelado</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Prioridad"
              name="priorityLevel"
              initialValue="Baja"
              rules={[{ required: true, message: 'Selecciona un nivel de prioridad' }]}
            >
              <Select>
                <Select.Option value="Baja">Baja</Select.Option>
                <Select.Option value="Media">Media</Select.Option>
                <Select.Option value="Alta">Alta</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Usuario Asignado"
              name={['assigned_user', '_id']}
              rules={[{ required: true, message: 'Selecciona un usuario asignado' }]}
            >
              <Select showSearch 
            placeholder="Selecciona un usuario"
            allowClear
                options={users.map((user) => ({
                  label: `${user.first_name} ${user.last_name}`,
                  value: user._id,
                }))}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item label="Fecha de creación" name="created_at" initialValue={dayjs()}>
              <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Fecha de Finalización" name="completed_at" initialValue={dayjs()}>
              <DatePicker format="DD-MM-YYYY"  style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          {/* COLUMNA DERECHA */}
          <Col span={12}>
            <Form.Item label="Proyecto" name="project" rules={[{ required: true, message: 'Por favor selecciona un proyecto' }]}>
              <Select placeholder="Selecciona proyecto">
                {projects.map((p) => (
                  <Select.Option key={p._id} value={p._id}>{p.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item 
              label="Equipo" 
              name={['assigned_team', 'idTeam']} 
              rules={[{ required: true, message: 'Por favor selecciona un equipo' }]}
            >
              <Select
                showSearch
                placeholder="Selecciona equipo"
                allowClear
                options={teams.map((team) => ({
                  label: team.name,  
                  value: team.idTeam,
                }))}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item label="Autorizado por" name={['authorized_by', '_id']} initialValue={currentUser?._id}>
              <Select disabled={true} placeholder="Autorizante">
                {users.map((u) => (
                  <Select.Option key={u._id} value={u._id}>{u.first_name} {u.last_name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Fecha de Vencimiento" name="due_date"  initialValue={dayjs().add(1, 'day')} rules={[{ required: true }]}>
              <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Descripción" name="description" rules={[{ required: true, message: 'Por favor ingresa una descripción' }]}>
              <Input.TextArea rows={1} placeholder="Breve descripción..." />
            </Form.Item>
          </Col>

          {/* COLUMNA COMPLETA ABAJO: Observaciones y Comentarios */}
          <Col span={24}>
            <Form.Item label="Observaciones" name="observations">
              <Input.TextArea placeholder="Observaciones adicionales" rows={2} />
            </Form.Item>

            <Divider orientation="horizontal">Comentarios</Divider>
            
           <Form.List name="comments">
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => (
          <div
            key={key}
            style={{
              background: '#f9f9f9',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '10px',
              border: '1px solid #f0f0f0'
            }}
          >
            <Row gutter={16} align="top">
              <Col span={14}>
                <Form.Item
                  {...restField}
                  label="Mensaje"
                  name={[name, 'message']}
                  rules={[{ required: true, message: 'Ingresa el mensaje' }]}
                >
                  <Input.TextArea 
                    placeholder="Escribe un comentario..." 
                    rows={4} 
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  {...restField}
                  label="Fecha de Creación"
                  name={[name, 'created_at']}
                  initialValue={dayjs()}
                >
                  <DatePicker 
                    format="DD-MM-YYYY" 
                    style={{ width: '100%' }} 
                    disabled={true} 
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Autor"
                  name={[name, 'author']}
                  initialValue={currentUser?._id}
                >
                  <Select 
                    disabled={true} 
                    placeholder="Autor"
                    style={{ width: '100%' }}
                  >
                    {users.map((user) => (
                      <Select.Option key={user._id} value={user._id}>
                        {user.first_name} {user.last_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={2} style={{ textAlign: 'right', paddingTop: '30px' }}>
                <Button 
                  type="text" 
                  danger 
                  onClick={() => remove(name)} 
                  //Solo podrán quitar sus comentarios los autores.
                  disabled={users.find(u => u._id === form.getFieldValue(['comments', name, 'author']))?._id !== currentUser?._id}
                  title="Eliminar comentario"
                >Quitar
                </Button>
              </Col>
            </Row>
          </div>
        ))}
                  <Button type="dashed" onClick={() => add()} block style={{ marginTop: 10 }}>
                    + Agregar Comentario
                  </Button>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
    </GenericModal>
  );
};

export default TaskModal;