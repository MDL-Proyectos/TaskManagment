import express from 'express'
import bcrypt from 'bcrypt'
import logger from '../utils/logger.js'

import TaskProject from '../schemas/taskProject.js'
import Team from '../schemas/team.js'
import Task from '../schemas/task.js'

const router = express.Router()

router.get('/', getAllTaskProjects)
router.get('/:id', getTaskProjectById)
router.post('/', createTaskProject)
router.put('/:id', updateTaskProject)
router.delete('/:id', deleteTaskProject)

async function getAllTaskProjects(req, res, next) {  
    try {
      const taskProject = await TaskProject.find({})
      .populate('assigned_team')
      res.send(taskProject)
    } catch (err) {
      next(err)
    }
}

async function getTaskProjectById(req, res, next) {

  try {
    //logger.info('getTaskProjectById')
    const taskProject = await TaskProject.findOne({ _id: req.params.id })
    .populate('assigned_team')
    res.send(taskProject)
  } catch (err) {
    next(err)
  }
}

async function createTaskProject(req, res, next) {
    //console.log('getAllUsers by user ', req.user._id)
    const taskProject = req.body
    try {
      logger.info('CREATE TASK PROJECT')
    
      const team = await Team.findOne({ idTeam: taskProject.assigned_team })
      if (!team) {
        return res.status(400).send('Equipo no encontrado.'); // Código 400 porque el cliente envió un team inválido
      }
      
      const taskProjectCreate = await TaskProject.create({
        ...taskProject,
        assigned_team: team._id
      })
      res.send(taskProjectCreate)
    } catch (err) {
      next(err)
    }
  }

  async function updateTaskProject(req, res, next) {

   // logger.info('UPDATE TASK PROJECT %s', req.body)
    const taskProject = req.params
    if (!req.params.id) {
      res.status(500).send('The param id is not defined');
    }
  
    try {
      const taskProjectUpdated = await TaskProject.findOne({ _id: req.params.id });
      
      if (req.body.assigned_team) {
        const asignedTeam = await Team.findOne({ idTeam: req.body.assigned_team })

        if (!asignedTeam) {
          logger.error('teamSelected not found.')
          return res.status(400).end()
        }
  
        req.body.assigned_team = asignedTeam._id
      }

      if (!taskProjectUpdated) {
        res.status(404).send('TaskProject not found');
        return res.status(400).send('TaskProject not found');
      } 
      await taskProjectUpdated.updateOne(req.body)

    res.send(`TaskProject Updated :  ${req.params.id}`)
    } catch (err) {
      next(err)
    }
  }

  async function deleteTaskProject(req, res, next) {
    logger.info('DELETE TASK PROJECT')

    try {
      if (req.user.role.is_admin) {
        logger.error('User is not admin.')
        return res.status(403).end()
      }

      if (!req.params.id) {
        return res.status(500).send('The param id is not defined');
      }

      const taskDeleted = await TaskProject.findOne({ _id: req.params.id });

      const listTask = await Task.find({project : taskDeleted});

    if (listTask.length > 0) {
      logger.error('El proyecto posee tareas asignadas');
      return res.status(400).send('The user cannot be deleted. Related tasks exist.');
    }

     const taskProjectDeleted = await TaskProject.findOneAndDelete({ _id: req.params.id });

      if (!taskProjectDeleted) {
        res.status(404).send('TaskProject not found');
        return res.status(400).send('TaskProject not found');
      } 


      res.send(taskProjectDeleted)
    } catch (err) {
      next(err)
    }
  }


  export default router