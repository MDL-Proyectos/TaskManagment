import { Router } from 'express'
import User from '../schemas/user.js'
import logger from '../utils/logger.js'

import generateUserToken from '../utils/generate-user-and-token.js'

const router = new Router()

router.post('/', createUserToken)

async function createUserToken(req, res, next) {
  logger.info(`Creating user token for ${req.body.email}`)

  if (!req.body.email) {
    logger.error('Missing email parameter. Sending 400 to client')
    return res.status(400).end()
  }

  if (!req.body.password) {
    logger.error('Missing password parameter. Sending 400 to client')
    return res.status(400).end()
  }

  try {
    const user = await User.findOne({ email: req.body.email }, '+password')

    if (!user) {
      logger.error('User not found. Sending 404 to client')
      return res.status(401).end()
    }

    logger.info('Checking user password')
    const result = await user.checkPassword(req.body.password)

    if (result.isLocked) {
      logger.error('User is locked. Sending 400 (Locked) to client')
      return res.status(400).end()
    }

    if (!result.isOk) {
      logger.error('User password is invalid. Sending 401 to client')
      return res.status(401).end()
    }

    const response = await generateUserToken(req, user)
    //console.log(user.toJSON())
    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

export default router
