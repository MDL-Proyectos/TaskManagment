import mongodb from 'mongodb'

const { ObjectId } = mongodb

const initialUsers = [
  {
  _id: new ObjectId('6974ea1bddd3f64c26fe981f'),
  first_name: "ADMIN",
  last_name: "-",
  password: "$2b$10$IhJxpJSkAq0Ky7tuZIeT8eV0xrymTsltMPoVxl.MqJOguNMJ745nO",
  team: new ObjectId('6974e9d5ddd3f64c26fe97e6'),
  role: new ObjectId('69334aaf3bee569f0917415b'),
  observations: "Usuario default.",
  email: "admin@tm.com",
  phone: "",
  is_deleted: false,
  is_leader: true,
  __v: 0
  }
]

export const up = async (db) => {
  await db.collection('tm-users').insertMany(initialUsers)
}

export const down = async (db) => {
  await db.collection('tm-users').deleteMany({
    _id: {
      $in: initialUsers.map((user) => user._id),
    },
  })
}