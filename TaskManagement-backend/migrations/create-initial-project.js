import mongodb from 'mongodb'

const { ObjectId } = mongodb

const initialProjects = [
  {
  _id: new ObjectId('000000000000000000000001'),
  idTeam: new ObjectId('673d17b971ace271c5de6372'),
  name: "sin asignar",
  status: "Abierto",
  is_deleted: false,
  __v: 0
  }
]

export const up = async (db) => {
  await db.collection('tm-projects').insertMany(initialProjects)
}

export const down = async (db) => {
  await db.collection('tm-projects').deleteMany({
    _id: {
      $in: initialProjects.map((project) => project._id),
    },
  })
}
