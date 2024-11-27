function authorization(req, res, next) {
  req.isAdmin = function isAdmin() {
    return req.user && req.user.role === 'admin'
  }

  req.isClient = function isClient() {
    return req.user && req.user.role === 'client'
  }

  return next(null)
}

export default authorization
