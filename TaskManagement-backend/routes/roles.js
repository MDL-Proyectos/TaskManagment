import express from 'express'
import bcrypt from 'bcrypt'
import logger from '../utils/logger.js'

import Role from '../schemas/role.js'

const router = express.Router()

router.get('/', getAllRoles)
router.get('/:name', getTaskByName)
router.post('/', createRole)
router.put('/:name', updateRole)
router.delete('/:name', deleteRole)

async function getAllRoles(req, res, next) {
    //console.log('getAllUsers by user ', req.user._id)
    try {
   //   logger.info('getAllRoles')
      const role = await Role.find({})
      res.send(role)
    } catch (err) {
      next(err)
    }
}

async function getTaskByName(req, res, next) {
  //logger.info('getTaskByName by name ', req.params.name)
  try {
   // logger.info('getTaskByName')
    const role = await Role.findOne({ name: req.params.name })
    res.send(role)
  } catch (err) {
    next(err)
  }
}

async function createRole(req, res, next) {
    //console.log('getAllUsers by user ', req.user._id)
    const role = req.body
    try {
      logger.info('CREATE NEW ROLE')

      const roleCreate = await await Role.create({
        ...role
      })
      res.send(roleCreate)
    } catch (err) {
      next(err)
    }
  }

  async function updateRole(req, res, next) {
    //console.log('getAllUsers by user ', req.user._id)
    const role = req.params
    if (!req.params.name) {
      res.status(500).send('The param id is not defined');
    }
  
    try {
     // logger.info(req.params)
      const roleUpdated = await Role.findOne({name : req.params.name});
     
      if (!roleUpdated) {
        res.status(404).send('Role not found');
        return res.status(400).send('Role not found');
      } 
      await roleUpdated.updateOne(req.body)
      //logger.info(roleUpdated)
  
    res.send(`Role Updated :  ${req.params.id}`)
    } catch (err) {
      next(err)
    }
  }

  async function deleteRole(req, res, next) {
    logger.info('DELETE ROLE: ', req.params.name)
    try {
      if (req.user.role.is_admin) {
        logger.error('User is not admin.')
        return res.status(403).end()
      }
     const roleDeleted = await Role.findOneAndDelete({name : req.params.name});
      if (!roleDeleted) {
        res.status(404).send('Role not found');
        return res.status(400).send('Role not found');
      } 
      res.send(roleDeleted)
    } catch (err) {
      next(err)
    }
  }


  export default router