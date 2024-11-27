import jwt from 'jsonwebtoken'
// import fs from 'fs'
// import path from 'path'

import Role from '../schemas/role.js'

async function generateUserToken(req, user) {
  const role = await Role.findById(user.role).exec()

  const payload = {
    _id: user._id,
    role: role.name,
  }

  const userResponse = {
    _id: user._id,
    role: role.name,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  }

  // const privateKey = fs.readFileSync(path.join(__dirname, `../keys/base-api-express-generator.pem`))

  // Unsecure alternative
  const token = jwt.sign(payload, 'base-api-express-generator', {
    subject: user._id.toString(),
    issuer: 'base-api-express-generator',
  })

  // const token = jwt.sign(payload, privateKey, {
  //   subject: user._id.toString(),
  //   issuer: 'base-api-express-generator',
  //   algorithm: 'RS256',
  // })

  return { token, user: userResponse }
}

export default generateUserToken
