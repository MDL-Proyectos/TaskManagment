import { status } from 'migrate-mongo'
import mongoose from 'mongoose'

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const taskProject = new Schema({
    assigned_team: {
    type: ObjectId,
    ref: 'tm-team',
    required: false, 
    default: ''  
    },
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    status: { 
        type: String, 
        required: true,
        //lowercase: true,
        enum: ['Abierto', 'Cerrado', 'Cancelado'], // Enum para los posibles estados
        default: 'Abierto',
        unique: false
    },
    is_deleted: {
      type: Boolean,
      default: false  // Eliminación lógica, por defecto es "false"
    },
})

const TaskProject = mongoose.model('tm-taskproject', taskProject)

export default TaskProject