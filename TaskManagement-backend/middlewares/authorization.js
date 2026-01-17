import logger from '../utils/logger.js'
import jwt from 'jsonwebtoken'

function authorization(req, res, next) {
 //logger.info('Authorization middleware - User role: %s', req.user )
 const token = req.headers.authorization?.split(' ')[1]
 if (!token) {
   logger.error('No token provided. Sending 401 to client')
   return res.status(401).end()
 }  

 const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
  //decoded._id && !decoded.role.is_admin
  req.user = decoded

  req.isAdmin = function isAdmin() {
    return req.user._id && !req.user.role.is_admin
  }

  req.isClient = function isClient() {
    //return req.user && req.user.role === 'client'
    return req.user._id && req.user.role.is_admin
  }

  return next(null)
}

export default authorization
