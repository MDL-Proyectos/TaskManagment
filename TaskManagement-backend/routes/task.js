import express from 'express'
import bcrypt from 'bcrypt'
import logger from '../utils/logger.js'

import Task from '../schemas/task.js'
import Team from '../schemas/team.js'
import User from '../schemas/user.js'
import dayjs from 'dayjs';
const router = express.Router()

router.get('/', getAllTasks)
router.get('/:id', getTaskById)
router.post('/', createTask)
router.put('/:id', updateTask)
router.delete('/delete/:id', deleteTask)

async function getAllTasks(req, res, next) {
    //logger.log('getAllUsers by user ', req.user._id)
    try {
      logger.info('getAllTasks')
      const task = await Task.find({})
      .populate('assigned_team')
      .populate('assigned_user')
      .populate('authorized_by')
      .populate('project')
      res.send(task)
    } catch (err) {
      next(err)
    }
  }

  async function getTaskById(req, res, next) {
   // logger.info('getTask with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
  }
    try {
      logger.info('getTaskById')
      const task = await Task.findById(req.params.id)
      .populate('assigned_team')
      .populate('assigned_user')
      .populate('authorized_by')
      res.send(task)
    } catch (err) {
      next(err)
    }
  }

async function createTask(req, res, next) {
   // logger.info('post task ', req.body)
    const task = req.body
    try {
   //   logger.info(' task.assigned_team ' + task.assigned_team)
      const team = await Team.findOne({ idTeam: task.assigned_team.idTeam })
    if (!team) {
      res.status(404).send('Team not found')
    }

    task.updated_at = dayjs().toDate();

    //Valido usuario asignado
    if (task.assigned_user) {
      const userAssigned = await User.findById(task.assigned_user)

      if (!userAssigned) {
        logger.error('userAssigned not found.')
        return res.status(400).end()
      }
      req.body.assigned_user = userAssigned._id
    }

    //Valido autor
    if (task.comments && Array.isArray(task.comments)) { //es una coleccion
      for (const comment of task.comments) {
      //  logger.info('Validating comment author:', comment.author);
        if (comment.author) {
          const userAuthor = await User.findById(comment.author);
          if (!userAuthor) {
            logger.error('userAuthor not found for comment.');
            return res.status(400).send('Invalid comment author');
          }
          comment.author = userAuthor._id; // Reemplaza con el ID validado
        } else {
          logger.error('Comment author is missing.');
          return res.status(400).send('Comment author is required');
        }
      }
    } 

    //Valido Usuario autorizador
    if (task.authorized_by) {
      const authorizedUser = await User.findById(task.authorized_by)

      if (!authorizedUser) {
        logger.error('authorizedUser not found.')
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
    //console.log('taskUpdated with id: ', req.params.id)
    //console.log(req.body)
  
    if (!req.params.id) {
      return res.status(404).send('Parameter id not found')
    }
  
    //if (!req.isAdmin() && req.params.id != req.user._id) {
    // return res.status(403).send('Unauthorized')
    //}      
    /*delete req.body.created_at
    delete req.body.due_date
    delete req.body.comments.author
    delete req.body.comments.created_at
    delete req.body.project*/

    try {
      //Valido tarea
      const taskToUpdate = await Task.findById(req.params.id)
      const taskNewData = req.body
      if (!taskToUpdate) {
        logger.error('Task not found')
        return res.status(404).send('Task not found')
      }  

      //Valido grupo
      if (taskNewData.assigned_team) {
        const teamSelected = await Team.findOne({ idTeam: taskNewData.assigned_team.idTeam })
  
        if (!teamSelected) {
          logger.error('teamSelected not found.')
          return res.status(400).end()
        }
        req.body.assigned_team = teamSelected._id
      }
       
      //valido el usuario asignado
      if (taskNewData.assigned_user) {
        const newUserAssigned = await User.findById(taskNewData.assigned_user)
  
        if (!newUserAssigned) {
          logger.error('newUserAssigned not found.')
          return res.status(400).end()
        }
        req.body.assigned_user = newUserAssigned._id
      }

      //valido el usuario autorizador
      //logger.info("authorized_by " + taskNewData.authorized_by)
      if (taskNewData.authorized_by) {
        const userAuthorized = await User.findById(taskNewData.authorized_by)
  
        if (!userAuthorized) {
          logger.error('userAuthorized not found.')
          return res.status(400).end()
        }
        req.body.authorized_by = userAuthorized._id
      }else{
        logger.error('userAuthorized not found.')
        return res.status(400).end()
      }
      req.body.updated_at = dayjs().toDate();
  
      await taskToUpdate.updateOne(req.body)
      //logger.info(taskToUpdate)
      res.send(taskToUpdate)

    } catch (err) {
      next(err)
    }
  }

  async function deleteTask(req, res, next) {
    if (!req.params.id) {
      return res.status(404).send('Parameter id not found')
    }
    try {
       if (req.user.role.is_admin) {
        logger.error('User is not admin.')
        return res.status(403).end()
      }
      //Valido tarea
      const taskDeleted = await Task.findOneAndDelete({_id : req.params.id});
      if (!taskDeleted) {
        res.status(404).send('Task not found');
        return res.status(400).send('Task not found');
      } 
      res.send(taskDeleted)
    }catch(err){
      next(err);
    }

  }

  export default router