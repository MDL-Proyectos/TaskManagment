import express from 'express'
import bcrypt from 'bcrypt'

import Team from '../schemas/team.js'

const router = express.Router()

router.get('/', getAllTeams)
//router.get('/:id', getTaskById)
router.post('/', createTeam)
router.put('/:id', updateTeam)
//router.delete('/:id', deleteTask)

async function getAllTeams(req, res, next) {
    //console.log('getAllUsers by user ', req.user._id)
    try {
      console.log('getAllTeams')
      const teams = await Team.find({}).populate('liderTeam')
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
  async function updateTeam(req, res, next) {
    console.log('updateTeam with id: ', req.params.id)
  
    if (!req.params.id) {
      return res.status(404).send('Parameter id not found')
    }
    
  
    //if (!req.isAdmin() && req.params.id != req.user._id) {
    // return res.status(403).send('Unauthorized')
    //}      
  
    try {
      const teamToUpdate = await Team.findById(req.params.id)
      const teamNewData = req.body
      if (!teamToUpdate) {
        console.error('Team not found')
        return res.status(404).send('Team not found')
      }

      if (teamToUpdate.idTeam) {
        const teamSelected = await Team.findOne({ idTeam: teamNewData.idTeam })
  
        if (!teamSelected) {
          console.info('teamSelected not found.')
          return res.status(400).end()
        }
        req.body.id = teamSelected._id
      }
    
  
      await teamToUpdate.updateOne(req.body)
      console.log(teamToUpdate)
      res.send(teamToUpdate)

    } catch (err) {
      next(err)
    }
  }

  export default router