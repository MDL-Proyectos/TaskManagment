import mongoose from 'mongoose'
import validate from 'mongoose-validator'
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types //usar en el usuario. EJ: role: { type: ObjectId, ref: 'Role', required: true },

// Definir el esquema de la tarea (task)
const taskSchema = new Schema({
    title: {
    type: String,
    required: true
    },
    assigned_team: {
      type: ObjectId,  // Array de equipos asignados
    ref: 'tm-user', 
    required: false
    },
    assigned_user: {
    type: String,  // Usuario asignado (puedes referenciar un usuario por su ID si prefieres)
    required: true
    },
    status: {
    type: String,
    required: true,
    enum: ['Nuevo', 'En progreso', 'Completado'], // Enum para los posibles estados
    default: 'Nuevo'  // Si no se proporciona un estado, por defecto será "Nuevo"
    },
    created_at: {
    type: Date,
      default: Date.now  // Fecha de creación, por defecto es la fecha actual
    },
    due_date: {
    type: Date,
      required: true  // Fecha de vencimiento de la tarea
    },
    completed_at: {
    type: Date,
      default: null  // Fecha de finalización, por defecto es null si la tarea no ha sido completada
    },
    comments: [
    {
        author: {
        type: String,  // Autor del comentario
        required: true
        },
        message: {
          type: String,  // Mensaje del comentario
          required: true
        },
        created_at: {
          type: Date,
          default: Date.now  // Fecha de creación del comentario
        }
      }
    ],
    project: {
      type: String,  // Proyecto al que pertenece la tarea
      required: true
    },
    authorized_by: {
      type: String,  // Usuario que autoriza la tarea
      required: true
    },
    observations: {
      type: String,
      default: ''  // Observaciones adicionales (puede ser vacío por defecto)
    }
  });

const Task = mongoose.model('tm-task', taskSchema)

export default Task
