import jwt from 'jsonwebtoken'
// import fs from 'fs'
// import path from 'path'

import Role from '../schemas/role.js'

async function generateUserToken(req, user) {
  const role = await Role.findById(user.role).exec()
  console.log('User role:', role)
  const payload = {
    _id: user._id,
    role: role,
  }

  const userResponse = {
    _id: user._id,
    role: role,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
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
