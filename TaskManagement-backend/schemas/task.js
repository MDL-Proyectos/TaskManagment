import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types //usar en el usuario. EJ: role: { type: ObjectId, ref: 'Role', required: true },

// Definir el esquema de la tarea (task)
const taskSchema = new Schema({
    title: { //modificable
    type: String,
    required: true
    },
    description: { //modificable
    type: String,
    required: true
    },
    assigned_team: { //modificable
      type: ObjectId,  // Array de equipos asignados
    ref: 'tm-team', 
    required: false
    },
    assigned_user: { //modificable
    type: ObjectId,// Usuario asignado (puedes referenciar un usuario por su ID si prefieres)
    ref: 'tm-user', 
    required: false
    },
    status: { //modificable
    type: String,
    required: true,
    enum: ['Nuevo', 'En Progreso', 'Completado'], // Enum para los posibles estados
    default: 'Nuevo'  // Si no se proporciona un estado, por defecto será "Nuevo"
    },
    created_at: {
      type: String,
      default: Date.now,
      get: (date) => dayjs(date).format('DD-MM-YYYY')  // Fecha de creación, por defecto es la fecha actual
    },
    due_date: {
      type: String,
      default: Date.now,
      get: (date) => dayjs(date).format('DD-MM-YYYY'),
      required: true  // Fecha de vencimiento de la tarea
    },
    completed_at: { //modificable
      type: String,
      default: Date.now,
      get: (date) => dayjs(date).format('DD-MM-YYYY'),
      default: null  // Fecha de finalización, por defecto es null si la tarea no ha sido completada
    },
    comments: [
    {
        author: { 
          type: ObjectId, 
          ref: 'tm-user', 
          required: true
        },
        message: {
          type: String,  // Mensaje del comentario
          required: true
        },
        created_at: {
          type: String,
          default: Date.now,
          get: (date) => dayjs(date).format('DD-MM-YYYY')  // Fecha de creación del comentario
        }
      }
    ],
    project: {
      type: String,  // Proyecto al que pertenece la tarea
      required: true
    },
    authorized_by: {
      type: ObjectId, 
      ref: 'tm-user', // Usuario que autoriza la tarea
      required: false
    },
    observations: { //modificable
      type: String,
      default: ''  // Observaciones adicionales (puede ser vacío por defecto)
    }
  });

const Task = mongoose.model('tm-task', taskSchema)

export default Task
