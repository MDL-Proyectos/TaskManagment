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
  },
  {
  _id: new ObjectId('6746f00194367c58fadffe1f'),
  idTeam: "00002",
  name: "team qa-ux",
  is_deleted: false,
  __v: 0,
  liderTeam: new ObjectId('6974ea1bddd3f64c26fe981f'),
  }
]

export const up = async (db) => {
  await db.collection('tm-teams').insertMany(initialTeams)
}

export const down = async (db) => {
  await db.collection('tm-teams').deleteMany({
    _id: {
      $in: initialTeams.map((team) => team._id),
    },
  })
}
