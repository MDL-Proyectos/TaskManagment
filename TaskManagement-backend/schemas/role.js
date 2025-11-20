import mongoose from 'mongoose'

const { Schema } = mongoose

const roleSchema = new Schema({
  name: { type: String, required: true, lowercase: true, trim: true, unique: true },
  is_admin:{ type: Boolean, required: true, default: false},
  is_deleted: { type: Boolean, required: true, default: false}
})

const Role = mongoose.model('Role', roleSchema)

export default Role
