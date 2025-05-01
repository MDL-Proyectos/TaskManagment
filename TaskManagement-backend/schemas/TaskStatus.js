import mongoose from 'mongoose'

const { Schema } = mongoose

const statusTask = new Schema({
  name: { type: String, required: true, uppercase: true, trim: true, unique: true },
})

const TaskStatus = mongoose.model('TaskStatus', statusTask)

export default TaskStatus
