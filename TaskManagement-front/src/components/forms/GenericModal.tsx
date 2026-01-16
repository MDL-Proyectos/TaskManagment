import React from 'react';
import { Modal, Form, FormInstance, Button } from 'antd';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';

interface GenericFormModalProps {
  open: boolean;
  title: string;
  confirmLoading: boolean;
  
  // Handlers y Lógica de Edición
  onClose: () => void;
  onSubmit: (values: any) => void;
  isEditing: boolean; 
  onDelete?: () => void; 
  
  // Para los campos específicos de la entidad
  children: React.ReactNode; 
  
  // Instancia del Formulario
  form: FormInstance; 
}

const GenericFormModal: React.FC<GenericFormModalProps> = ({
  open,
  title,
  confirmLoading,
  onClose,
  onSubmit,
  isEditing, 
  onDelete,
  children,
  form
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      confirmLoading={confirmLoading}
      onOk={() => {
        form.validateFields()
          .then(values => {
            onSubmit(values); // Llama a la lógica de envío del componente padre
          })
          .catch(info => {
            console.log('Validación fallida:', info);
          });
      }}
    
      footer={[
        // Botón Cancelar
        <Button key="back" onClick={onClose} disabled={confirmLoading}>
          Cancelar
        </Button>,
        // Botón Eliminar
        isEditing && onDelete && (
          <Button
            key="delete"
            type="default"
            danger
            onClick={onDelete}
            loading={confirmLoading}
            icon={<DeleteOutlined />}
          >
            Eliminar
          </Button>
        ),
        // Botón principal de Guardar/Crear
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()} 
          loading={confirmLoading}
          icon={<SaveOutlined />}
        >
          {isEditing ? 'Guardar Cambios' : 'Crear'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit} 
      >
        {children}
      </Form>
    </Modal>
  );
};

export default GenericFormModal;