import express from 'express'
import bcrypt from 'bcrypt'

import TaskStatus from '../schemas/TaskStatus.js'
import Task from '../schemas/task.js'

const router = express.Router()

router.get('/', getAllTaskStatus)
router.get('/:name', getTaskStatusByName)
router.post('/', createTaskStatus)
router.put('/:name', updateTaskStatus)
router.delete('/:name', deleteTaskStatus)

async function getAllTaskStatus(req, res, next) {
    //console.log('getAllTaskStatus...')
    try {
     
      const status = await TaskStatus.find({})
      res.send(status)
    } catch (err) {
      next(err)
    }
}

async function getTaskStatusByName(req, res, next) {
  //console.log('getTaskStatusByName by name ', req.params.name)
  try {
    
    const status = await TaskStatus.findOne({ name: req.params.name })
    res.send(status)
  } catch (err) {
    next(err)
  }
}

async function createTaskStatus(req, res, next) {
    //console.log('getAllUsers by user ', req.user._id)
    const status = req.body

    try {
      const statusNew = await TaskStatus.findOne({name: status.name})

    if (statusNew)
    {
     console.log('TaskStatus Exist');
      return res.status(404).send('TaskStatus exist.');
    }
    const taskStatusCreating = await TaskStatus.create({
      ...status
    })
    res.send(taskStatusCreating)

      
    } catch (err) {
      next(err)
    }
  }

  async function updateTaskStatus(req, res, next) {
    
    if (!req.params.name) {
      res.status(500).send('The param id is not defined');
    }
  
    try {
      console.log(req.params)
      const taskStatusUpdated = await TaskStatus.findOne({name : req.params.name});
     
      if (!taskStatusUpdated) {
        console.log('TaskStatus not found');
        return res.status(400).send('TaskStatus not found');
      } 
      await taskStatusUpdated.updateOne(req.body)
      console.log(taskStatusUpdated)
  
    res.send(`TaskStatus Updated :  ${req.params.id}`)
    } catch (err) {
      next(err)
    }
  }

  async function deleteTaskStatus(req, res, next) {
    console.log('DELETE TaskStatus: ', req.params.name);
    try {
      // 1. Primero, verifica si existen tareas con el estado a eliminar
      const taskAssigned = await Task.findOne({ status: req.params.name });
  
      if (taskAssigned) {
        return res.status(409).send('Existen tareas con el estado asignado. No se puede eliminar.');
      }
  
      // 2. Si no hay tareas asignadas, procede con la eliminación
      const taskStatusDeleted = await TaskStatus.findOneAndDelete({ name: req.params.name });
  
      if (!taskStatusDeleted) {
        return res.status(404).send('Estado de tarea no encontrado.');
      }
  
      // 3. Si se eliminó correctamente, envía la respuesta
      res.status(200).send(taskStatusDeleted); // O res.status(204).send() si no quieres devolver el objeto eliminado
    } catch (err) {
      next(err);
    }
  }


  export default router