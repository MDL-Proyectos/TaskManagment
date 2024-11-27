import express from 'express'
import bcrypt from 'bcrypt'

import Task from '../schemas/task.js'
import Team from '../schemas/team.js'
import User from '../schemas/user.js'

const router = express.Router()

router.get('/', getAllTasks)
//router.get('/:id', getTaskById)
router.post('/', createTask)
router.put('/:id', updateTask)
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
    console.log('post task ', req.body)
    const task = req.body
    try {
      console.log(' task.assigned_team ' + task.assigned_team)
      const team = await Team.findOne({ idTeam: task.assigned_team })
    if (!team) {
      res.status(404).send('Team not found')
    }

    //Valido usuario asignado
    if (task.assigned_user) {
      const userAssigned = await User.findById(task.assigned_user)

      if (!userAssigned) {
        console.info('userAssigned not found.')
        return res.status(400).end()
      }
      req.body.assigned_user = userAssigned._id
    }

    //Valido autor
    if (task.comments && Array.isArray(task.comments)) { //es una coleccion
      for (const comment of task.comments) {
        console.log('Validating comment author:', comment.author);
        if (comment.author) {
          const userAuthor = await User.findById(comment.author);
          if (!userAuthor) {
            console.info('userAuthor not found for comment.');
            return res.status(400).send('Invalid comment author');
          }
          comment.author = userAuthor._id; // Reemplaza con el ID validado
        } else {
          console.info('Comment author is missing.');
          return res.status(400).send('Comment author is required');
        }
      }
    } 

    //Valido Usuario autorizador
    if (task.authorized_by) {
      const authorizedUser = await User.findById(task.authorized_by)

      if (!authorizedUser) {
        console.info('authorizedUser not found.')
        return res.status(400).end()
      }
      req.body.authorized_by = authorizedUser._id
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

  async function updateTask(req, res, next) {
    console.log('taskUpdated with id: ', req.params.id)
  
    if (!req.params.id) {
      return res.status(404).send('Parameter id not found')
    }
    
  
    //if (!req.isAdmin() && req.params.id != req.user._id) {
    // return res.status(403).send('Unauthorized')
    //}      
    delete req.body.created_at
    delete req.body.due_date
    delete req.body.comments.author
    delete req.body.comments.created_at
    delete req.body.project
    delete req.body.authorized_by

    try {
      //Valido tarea
      const taskToUpdate = await Task.findById(req.params.id)
      const taskNewData = req.body
      if (!taskToUpdate) {
        console.error('Task not found')
        return res.status(404).send('Task not found')
      }  

      //Valido grupo
      if (taskNewData.assigned_team) {
        const teamSelected = await Team.findOne({ idTeam: taskNewData.assigned_team })
  
        if (!teamSelected) {
          console.info('teamSelected not found.')
          return res.status(400).end()
        }
        req.body.assigned_team = teamSelected._id
      }
       
      console.log(taskNewData.assigned_user)
      //valido el usuario asignado
      if (taskNewData.assigned_user) {
        const newUserAssigned = await User.findById(taskNewData.assigned_user)
  
        if (!newUserAssigned) {
          console.info('newUserAssigned not found.')
          return res.status(400).end()
        }
        req.body.assigned_user = newUserAssigned._id
      }
    
  
      await taskToUpdate.updateOne(req.body)
      console.log(taskToUpdate)
      res.send(taskToUpdate)

    } catch (err) {
      next(err)
    }
  }

  export default router