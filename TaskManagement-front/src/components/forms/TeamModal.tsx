// src/components/forms/TeamFormModal.tsx

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, message, Switch } from 'antd';
// Asegúrate que los imports de tus servicios y entidades sean correctos
import TeamServices from '../../routes/TeamServices';
import UserServices from '../../routes/UserServices';
import { TeamData } from '../../entities/Team';
import { UsuarioData } from '../../entities/User';
import GenericFormModal from './GenericModal'; // Asume esta ruta
import userService from '../../routes/UserServices';

interface TeamFormModalProps {
  initialTeamId?: string | null;
  open: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const TeamFormModal: React.FC<TeamFormModalProps> = ({
  initialTeamId,
  open,
  onClose,
  onSaveSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UsuarioData[]>([]);
  const isEditMode = !!initialTeamId;


  const fetchTeam = async (idTeam: string) => {
    setLoading(true);
    try {
      const response = await TeamServices.getTeamById(idTeam);
      let leaderId = null;
        if (response.liderTeam) {
         leaderId = response.liderTeam._id || response.liderTeam; // Prioriza _id, sino usa el valor directo
        }
      const mappedData = {
        ...response,
        liderTeam: leaderId, // Pasa el ID (string o null) al campo del Form
        is_deleted: !response.is_deleted,
      };
      
      form.setFieldsValue(mappedData);
    } catch (error) {
      console.error('Error al obtener los datos del equipo:', error);
      message.error('Error al cargar los datos del equipo.');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {

      const listUsers = await UserServices.getUsers(); 
      const userLeaders = listUsers.filter(user => user.is_leader && !user.is_deleted);
      // Filtrar solo usuarios activos
      setUsers(userLeaders); 
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      message.error('Error al cargar la lista de usuarios.');
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
      if (initialTeamId) {
        // Modo Edición
        fetchTeam(initialTeamId);
      } else {
        // Modo Creación
        form.resetFields();
        form.setFieldsValue({ is_deleted: true });
      }
    }
  }, [initialTeamId, form, open]);


  const handleFinish = async (values: TeamData) => {
    setLoading(true);
    
    try {
      if (isEditMode) {
        // Usar el ID original para la actualización
        await TeamServices.updateTeam(initialTeamId as string, values);
        message.success('Equipo actualizado correctamente');
      } else {
        await TeamServices.createTeam(values);
        message.success('Equipo creado correctamente');
      }
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Error al guardar el Equipo:', error);
      message.error('No se pudo guardar el Equipo.');
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    setLoading(true);
    try {
      if (initialTeamId) {       
        const userList = await userService.getUsers();
          // Busca si algún usuario tiene asignado
        const isTeamUsed = userList.some((user: any) => user.team.idTeam === initialTeamId);
        if (!isTeamUsed) {
          await TeamServices.deleteTeam(initialTeamId); 
          message.success('Equipo eliminado correctamente');
        } else {
          console.error('El Team esta siendo utilizado:', initialTeamId);
          message.error('El Team esta siendo utilizado.');
          return; // Detenemos el flujo en caso de error
        }
      onSaveSuccess();
      onClose();

      }
    } catch (error) {
      message.error('No se pudo eliminar el equipo.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <GenericFormModal
      open={open}
      title={isEditMode ? "Editar Equipo" : "Crear Nuevo Equipo"}
      confirmLoading={loading}
      onClose={onClose}
      onSubmit={handleFinish} // Función que se ejecuta al pulsar Guardar/Crear
      isEditing={isEditMode} 
      onDelete={handleDelete} // Función que se ejecuta al pulsar Eliminar
      form={form}
    >     
      <Form.Item
        label="Identificación"
        name="idTeam"
        rules={[{ required: true, message: 'Por favor, ingresa el ID' }]}
      >
        <Input 
          placeholder="ID del Equipo" 
          disabled={isEditMode} // Deshabilitar si se está editando
        /> 
      </Form.Item>

      <Form.Item
        label="Nombre"
        name="name"
        rules={[{ required: true, message: 'Por favor, ingresa un nombre' }]}
      >
        <Input placeholder="Nombre del Equipo" />
      </Form.Item>

      <Form.Item
        label="Lider del Equipo"
        name="liderTeam" 
        rules={[{ required: false, message: 'Por favor, selecciona un usuario' }]}
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

      <Form.Item
        label="Activo"
        name="is_deleted"
        valuePropName="checked"
        // checked=true significa is_deleted=false
        getValueFromEvent={(checked) => checked}
        getValueProps={(value) => ({ checked: value })}
      >
        <Switch />
      </Form.Item>
    </GenericFormModal>
  );
};

export default TeamFormModal;