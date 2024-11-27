import express from 'express'
import bcrypt from 'bcrypt'

import Role from '../schemas/role.js'

const router = express.Router()

router.get('/', getAllRoles)
//router.get('/:id', getTaskById)
router.post('/', createRole)
//router.put('/:id', updateTask)
//router.delete('/:id', deleteTask)

async function getAllRoles(req, res, next) {
    //console.log('getAllUsers by user ', req.user._id)
    try {
      console.log('getAllRoles')
      const role = await Role.find({})
      res.send(role)
    } catch (err) {
      next(err)
    }
}

async function createRole(req, res, next) {
    //console.log('getAllUsers by user ', req.user._id)
    const role = req.body
    try {
      console.log('CREATE ROLE')

      const roleCreate = await Role.create({
        ...role
      })
      res.send(roleCreate)
    } catch (err) {
      next(err)
    }
  }


  export default router