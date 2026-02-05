import mongodb from 'mongodb'
import dayjs from 'dayjs'


const { ObjectId } = mongodb

const initialTasks = [
  {
  _id: new ObjectId('6974ea66ddd3f64c26fe9852'),
  title: "Crear usuarios",
  description: "Crear usuarios.",
  assigned_team: new ObjectId('6974ea66ddd3f64c26fe9852'),
  assigned_user: new ObjectId('6974ea1bddd3f64c26fe981f'),
  status: "Nuevo",
  priorityLevel: "Baja",
  created_at: dayjs().toDate(),
  due_date: dayjs().toDate(),
  completed_at: dayjs().toDate(),
  updated_at: dayjs().toDate(),
  comments: [],
  project: new ObjectId('69677dc89f63fb34decbf64a'),
  authorized_by: new ObjectId('6974ea1bddd3f64c26fe981f'),
  observations: "Tarea inicial.",
  __v: 0
  }
]

export const up = async (db) => {
  await db.collection('tm-task').insertMany(initialTasks)
}

export const down = async (db) => {
  await db.collection('tm-task').deleteMany({
    _id: {
      $in: initialTasks.map((task) => task._id),
    },
  })
}
