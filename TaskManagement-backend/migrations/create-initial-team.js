import mongodb from 'mongodb'

const { ObjectId } = mongodb

const initialTeams = [
  {
  _id: new ObjectId('6974e9d5ddd3f64c26fe97e6'),
  idTeam: "ADMIN",
  name: "admin",
  is_deleted: false,
  __v: 0,
  liderTeam: new ObjectId('6974ea1bddd3f64c26fe981f'),
  }
]

export const up = async (db) => {
  await db.collection('tm-team').insertMany(initialTeams)
}

export const down = async (db) => {
  await db.collection('tm-team').deleteMany({
    _id: {
      $in: initialTeams.map((team) => team._id),
    },
  })
}
