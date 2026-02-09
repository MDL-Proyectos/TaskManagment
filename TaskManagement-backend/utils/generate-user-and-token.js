import jwt from 'jsonwebtoken'
// import fs from 'fs'
// import path from 'path'

import Role from '../schemas/role.js'
import logger from '../utils/logger.js'

async function generateUserToken(req, user) {
  const role = await Role.findById(user.role).exec()
  //logger.info('User role:', role)
  const payload = {
    _id: user._id,
    is_leader: user.is_leader,
    role: role,
  }

  const userResponse = {
    _id: user._id,
    role: role,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    is_leader: user.is_leader,
    team: user.team,
  }

  // const privateKey = fs.readFileSync(path.join(__dirname, `../keys/base-api-express-generator.pem`))

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    subject: user._id.toString(),
    issuer: process.env.JWT_SECRET,
  })

  // const token = jwt.sign(payload, privateKey, {
  //   subject: user._id.toString(),
  //   issuer: 'base-api-express-generator',
  //   algorithm: 'RS256',
  // })

  return { token, user: userResponse }
}

export default generateUserToken
