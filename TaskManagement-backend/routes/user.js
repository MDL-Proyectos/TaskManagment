import express from 'express'
import bcrypt from 'bcrypt'

import User from '../schemas/user.js'
import Role from '../schemas/role.js'
import Team from '../schemas/team.js'

const router = express.Router()

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.put('/delete/:id', deleteUser)

function toDate(input) {
  const [day, month, year] = input.split('/')
  return new Date(year, month, day)
}

async function getAllUsers(req, res, next) {
  //console.log('getAllUsers by user ', req.user._id)
  try {
    console.log('getAllUsers by user ')
    const users = await User.find({})
    res.send(users)
  } catch (err) {
    next(err)
  }
}

async function getUserById(req, res, next) {
  console.log('getUser with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
  }

  try {
    const user = await User.findById(req.params.id).populate('role')

    if (!user || user.length == 0) {
      res.status(404).send('User not found')
    }

    res.send(user)
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

    const team = await Team.findOne({ idTeam: user.team })
    if (!team) {
      res.status(404).send('Team not found')
    }

    //const passEncrypted = await bcrypt.hash(user.password, 10)

    const userCreated = await User.create({
      ...user,
      team: team._id,
      password: user.password, //descativado el bcrypt
      role: role._id,
    })

    res.send(userCreated)
  } catch (err) {
    next(err)
  }
}

async function updateUser(req, res, next) {
  console.log('updateUser with id: ', req.params.id)

  if (!req.params.id) {
    return res.status(404).send('Parameter id not found')
  }

  //if (!req.isAdmin() && req.params.id != req.user._id) {
  // return res.status(403).send('Unauthorized')
  //}

  // The email can't be updated
  delete req.body.email

  try {
    const userToUpdate = await User.findById(req.params.id)
    const userNewData = req.body
    if (!userToUpdate) {
      console.error('User not found')
      return res.status(404).send('User not found')
    }

    if (userNewData.role) {
      const newRole = await Role.findOne({ name: userNewData.role })

      if (!newRole) {
        console.info('New role not found.')
        return res.status(400).end()
      }
      req.body.role = newRole._id
    }

    if (req.body.team) {
      console.log('team ' + userNewData.team)
      const newTeam = await Team.findOne({ idTeam: userNewData.team })

      if (!newTeam) {
        console.info('New team not found.')
        return res.status(400).end()
      }
      req.body.team = newTeam._id
    }

    if (req.body.password && false) { //descativado
      const passEncrypted = await bcrypt.hash(req.body.password, 10)
      req.body.password = passEncrypted
    }

    // This will return the previous status
    await userToUpdate.updateOne(req.body)
    console.log(userToUpdate)
    res.send(userToUpdate)

    // This return the current status
    // userToUpdate.password = req.body.password
    // userToUpdate.role = req.body.role
    // userToUpdate.firstName = req.body.firstName
    // userToUpdate.lastName = req.body.lastName
    // userToUpdate.phone = req.body.phone
    // userToUpdate.bornDate = req.body.bornDate
    //userToUpdate.isActive = req.body.isActive
     //await userToUpdate.save()
     //res.send(userToUpdate)
  } catch (err) {
    next(err)
  }
}

async function deleteUser(req, res, next) {
  console.log('deleteUser with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
  }

  try {
    const userDeleted = await User.findById(req.params.id)

    if (!userDeleted) {
      res.status(404).send('User not found')
    }

   // await User.deleteOne({ _id: user._id })
   userDeleted.is_deleted = true
    await userDeleted.updateOne(req.body)
    console.log(userDeleted)
    res.send(userDeleted)

  //  res.send(`User deleted :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

export default router
