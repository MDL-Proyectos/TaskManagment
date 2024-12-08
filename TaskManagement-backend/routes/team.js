import express from 'express'
import bcrypt from 'bcrypt'

import Team from '../schemas/team.js'
import User from '../schemas/user.js'

const router = express.Router()

router.get('/', getAllTeams)
router.get('/:id', getTeamById)
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

  async function getTeamById(req, res, next) {
    console.log('getTeamByID by team ', req.params)

    if (!req.params.id) {
      return res.status(404).send('Parameter id not found')
    }

    try {
      console.log('getTeamByID')
      const teamSelected = await Team.findOne({ idTeam: req.params.id })//.populate('liderTeam')
      res.send(teamSelected)
    } catch (err) {
      next(err)
    }
  }  

async function createTeam(req, res, next) {
    //console.log('getAllUsers by user ', req.user._id)
    const team = req.body
    delete req.body.liderTeam
    
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
    console.log('put team ', req.body)
    if (!req.params.id) {
      return res.status(404).send('Parameter id not found')
    }
    
  
    //if (!req.isAdmin() && req.params.id != req.user._id) {
    // return res.status(403).send('Unauthorized')
    //}      
  
    try {
      const teamToUpdate = await  Team.findOne({ idTeam: req.params.id })
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
     
      if (teamNewData.liderTeam._id) {
        console.log('Encontro registro de lider' + teamNewData.liderTeam._id)
        try{
          const liderSelected = await User.findById(teamNewData.liderTeam._id);
          if (!liderSelected) {
            console.info('teamSelected not found.')
            return res.status(404).send('LiderTeam not found')
          }
            req.body.liderTeam = liderSelected._id;
        }catch (err) {
          return res.status(404).send('LiderTeam not found')
        }
             
      }else{
        delete req.body.liderTeam
      }
    
  
      await teamToUpdate.updateOne(req.body)
      console.log(teamToUpdate)
      res.send(teamToUpdate)

    } catch (err) {
      next(err)
    }
  }

  export default router