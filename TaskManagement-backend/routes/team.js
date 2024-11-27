import express from 'express'
import bcrypt from 'bcrypt'

import Team from '../schemas/team.js'

const router = express.Router()

router.get('/', getAllTeams)
//router.get('/:id', getTaskById)
router.post('/', createTeam)
//router.put('/:id', updateTask)
//router.delete('/:id', deleteTask)

async function getAllTeams(req, res, next) {
    //console.log('getAllUsers by user ', req.user._id)
    try {
      console.log('getAllTeams')
      const teams = await Team.find({})
      res.send(teams)
    } catch (err) {
      next(err)
    }
  }

async function createTeam(req, res, next) {
    //console.log('getAllUsers by user ', req.user._id)
    const team = req.body
    try {
    
        const teamCreate = await Team.create({
          ...team
        })
    
        res.send(teamCreate)
      } catch (err) {
        next(err)
      }
  }

  async function createUser(req, res, next) {
    console.log('createUser: ', req.body)
  
    const user = req.body
  
    try {
      const role = await Role.findOne({ name: user.role })
      if (!role) {
        res.status(404).send('Role not found')
      }
  
      //const passEncrypted = await bcrypt.hash(user.password, 10)
  
      const userCreated = await User.create({
        ...user,
        bornDate: toDate(user.bornDate),
        password: user.password, //descativado el bcrypt
        role: role._id,
      })
  
      res.send(userCreated)
    } catch (err) {
      next(err)
    }
  }

  export default router