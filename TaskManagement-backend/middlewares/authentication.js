import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import logger from '../utils/logger.js'
// import fs from 'fs'
// import path from 'path'

// const publicKey = fs.readFileSync(path.join(__dirname, `../keys/base-api-express-generator.pub`))

function getToken(req, next) {
  const TOKEN_REGEX = /^\s*Bearer\s+(\S+)/g
  const matches = TOKEN_REGEX.exec(req.headers.authorization)

  if (!matches) {
    logger.error('no matchea')
    return next(new createError.Unauthorized())
  }

  const [, token] = matches
  return token
}

function authentication(req, res, next) {
  //console.error('req', req.headers.authorization)
  if (!req.headers.authorization) {
    logger.error('Missing authorization header')
    return next(new createError.Unauthorized())
  }

  const token = getToken(req, next)

  try {
    // Unsecure alternative
    req.user = jwt.verify(token, 'base-api-express-generator', {
      issuer: 'base-api-express-generator',
    })

    // Correct alternative
    // req.user = jwt.verify(token, publicKey, {
    //   algorithms: ['RS256'],
    //   issuer: 'base-api-express-generator',
    // })

    if (!req.user || !req.user._id || !req.user.role) {
      logger.error('Error authenticating malformed JWT')
      return next(new createError.Unauthorized())
    }

    logger.info(`User ${req.user._id} authenticated`)

    next(null)
  } catch (err) {
    if (err.message === 'invalid algorithm' || err.message === 'invalid signature') {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      logger.error(`Suspicious access attempt from ip=${ip} ${token}`)
    }
    if (err.name === 'TokenExpiredError') {
      logger.error('Expired token, sending 401 to client')
      return res.sendStatus(401)
    }
    return next(new createError.Unauthorized(err))
  }
}

export default authentication
