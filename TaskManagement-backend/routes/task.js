import express from 'express'
import bcrypt from 'bcrypt'

import Task from '../schemas/task.js'
import Team from '../schemas/team.js'

const router = express.Router()

router.get('/', getAllTasks)
//router.get('/:id', getTaskById)
router.post('/', createTask)
//router.put('/:id', updateTask)
//router.delete('/:id', deleteTask)

async function getAllTasks(req, res, next) {
    //console.log('getAllUsers by user ', req.user._id)
    try {
      console.log('getAllTasks')
      const task = await Task.find({})
      res.send(task)
    } catch (err) {
      next(err)
    }
  }

async function createTask(req, res, next) {
    //console.log('getAllUsers by user ', req.user._id)
    const task = req.body
    try {
      console.log(' task.assigned_team ' + task.assigned_team)
      const team = await Team.findOne({ idTeam: task.assigned_team })
    if (!team) {
      res.status(404).send('Team not found')
    }
        const taskCreate = await Task.create({
          ...task,
          assigned_team: team._id 
        })
    
        res.send(taskCreate)
      } catch (err) {
        next(err)
      }
  }  

  export default router