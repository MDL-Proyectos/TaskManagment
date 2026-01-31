// src/components/forms/ProjectTaskFormModal.tsx

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Switch, message } from 'antd';
import { TaskProjectData } from '../../entities/TaskProject';
import ProjectServices from '../../services/ProjectServices';
import TeamService from '../../services/TeamServices';
import { TeamData } from '../../entities/Team';
import GenericFormModal from './GenericModal';

interface ProjectTaskModalProps {
  initialTaskId?: string | null;
  open: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const ProjectTaskModal: React.FC<ProjectTaskModalProps> = ({
  initialTaskId,
  open,
  onClose,
  onSaveSuccess
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialTaskId;
  const [teams, setTeams] = useState<TeamData[]>([]); 

  const fetchProject = async () => {
    try {    
      const response = await ProjectServices.getTaskById(initialTaskId as string); 
      const mappedResponse = {
        ...response,
        idTeam: response.idTeam ? response.idTeam.idTeam : undefined,
      };
     
      // Actualiza los campos del formulario con los datos recibidos
      form.setFieldsValue(mappedResponse);
    } catch (error) {
      console.error('Error al obtener los datos del proyecto:', error);
      message.error('Error al cargar los datos del proyecto.');
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
    fetchTeams();
    if (open) {
      if (initialTaskId) {
        fetchProject();
      } else {
        form.resetFields();
        form.setFieldsValue({ is_deleted: false });
      }
    }
  }, [initialTaskId, open, form]);


  const handleFinish = async (values: TaskProjectData) => {
    setLoading(true);
    try {
      if (isEditMode) {
        // Lógica para actualizar el proyecto
        await ProjectServices.updateProject(initialTaskId as string, values);
      
        message.success('Equipo actualizado correctamente');        
        message.success('Proyecto actualizado correctamente');
      } else {
        // Lógica para crear un nuevo proyecto
        await ProjectServices.createProject(values);
        message.success('Proyecto creado correctamente');
      }
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Error al guardar el proyecto:', error);
      message.error('No se pudo guardar el proyecto.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <GenericFormModal
      open={open}
      title={isEditMode ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
      confirmLoading={loading}
      onClose={onClose}
      onSubmit={handleFinish}
      isEditing={isEditMode}
      form={form}
    >
      <Form.Item
        label="Nombre del Proyecto"
        name="name"
        rules={[{ required: true, message: 'Por favor, ingrese un nombre' }]}
      >
        <Input placeholder="Nombre del proyecto" />
      </Form.Item>
      <Form.Item
          label="Estado"
          name="status"
          rules={[{ required: true, message: 'Por favor, selecciona una prioridad' }]}
          
        >
          <Select>
            <Select.Option value="Abierto">Abierto</Select.Option>
            <Select.Option value="Cerrado">Cerrado</Select.Option>
            <Select.Option value="Cancelado">Cancelado</Select.Option>
          </Select>
        </Form.Item>

      <Form.Item
        label="Equipo"
        name="idTeam"
        rules={[{ required: true , message: 'Por favor, selecciona un equipo' }]}
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
        label="Activo"
        name="is_deleted"
        valuePropName="checked"
        getValueFromEvent={(checked) => !checked} // Convertir checked a la lógica de is_deleted
        getValueProps={(value) => ({ checked: !value })}
      >
        <Switch />
      </Form.Item>
    </GenericFormModal>
  );
};

export default ProjectTaskModal;