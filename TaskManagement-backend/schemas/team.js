import mongoose from 'mongoose'

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const teamSchema = new Schema({
    idTeam: {
        type: String,
        required: true,
        unique: true},
    name: { 
        type: String, 
        required: true,
        lowercase: true,
        trim: true, 
        unique: true },
    liderTeam: { 
        type: ObjectId, 
        ref: 'tm-user', 
        required: false   
    },
    is_deleted: {
      type: Boolean,
      default: false  // Eliminación lógica, por defecto es "false"
    },
})

const Team = mongoose.model('tm-team', teamSchema)

export default Team

