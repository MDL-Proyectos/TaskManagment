import mongodb from 'mongodb'

const { ObjectId } = mongodb

const initialRoles = [
  {
  _id: new ObjectId('69334aaf3bee569f0917415b'),
  name: "manager",
  is_admin: false,
  is_deleted: false,
  __v: 0
  }
]

export const up = async (db) => {
  await db.collection('tm-roles').insertMany(initialRoles)
}

export const down = async (db) => {
  await db.collection('tm-roles').deleteMany({
    _id: {
      $in: initialRoles.map((role) => role._id),
    },
  })
}
