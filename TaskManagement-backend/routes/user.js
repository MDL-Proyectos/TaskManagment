import express from 'express'
import bcrypt from 'bcrypt'
import logger from'../utils/logger.js';
import User from '../schemas/user.js'
import Role from '../schemas/role.js'
import Team from '../schemas/team.js'
import Task from '../schemas/task.js'

const router = express.Router()

router.get('/', getAllUsers)
router.get('/testpss/:name', passTest)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.put('/p/:id', updatePassword)
router.put('/p/reset/:id', resetPassword)
router.put('/p/validate/:id', validatePassword)
router.put('/blockUser/:id', blockUser)
router.delete('/delete/:id', deleteUser)

const saltRounds = 10; // Define el número de rondas de hashing
//prueba de hasheo
async function passTest(req, res, next){
  const passEncrypted = await bcrypt.hash(req.params.name, saltRounds);
  
  logger.info('name pss: ', req.params.name)
  logger.info('> pss: ', passEncrypted)
  res.send(passEncrypted) 
}


function toDate(input) {
  const [day, month, year] = input.split('/')
  return new Date(year, month, day)
}

async function getAllUsers(req, res, next) {
  //console.log('getAllUsers by user ', req.user._id)
  //logger.info('getAllUsers by user: %s ', req.user._id)
  try {
    const users = await User.find({}).populate('role').populate('team')
    res.send(users)
  } catch (err) {
    next(err)
  }
}

async function getUserById(req, res, next) {
  //console.log('getUser with id: ', req.params.id)

  if (!req.params.id) {
    return res.status(500).send('The param id is not defined');
  }

  try {
    const user = await User.findById(req.params.id).populate('role').populate('team')

    if (!user || user.length == 0) {
      return res.status(404).send('User not found');
    }

    res.send(user)
  } catch (err) {
    next(err)
  }
}

async function validatePassword(req, res, next) {
  const { userId, password, currentpassword } = req.body;
  try {
    const user = await User.findById(req.params.id, '+password');
    
    if (!user) {
      return res.status(404).send('User not found');
    }
    logger.info('User password hash: ', req.body.currentPassword);
   // console.log
    
    const result = await user.checkPassword(req.body.currentPassword)
    if (!result.isOk) {
      console.error('User password is invalid. Sending 401 to client')
      return res.status(401).end()
    }
       logger.info('Password is valid');
      res.status(200).send('Invalid password');
    
  } catch (err) {
    next(err);
  }
}



async function resetPassword(req, res, next) {
  const user = await User.findById(req.params.id);
  user.password = '1';
  
  try{
    // 1. Validar que los campos obligatorios estén presentes
    if (!user) {
      return res.status(400).send('Falta el usuario.');
    }
    // 2. Hashear la contraseña ANTES de actualizar el usuario
    const passEncrypted = await bcrypt.hash(user.password, saltRounds);

    user.password = passEncrypted;
    const team = await Team.findOne({ _id: user.team })
    if (!team) {
      return res.status(400).send('Equipo no encontrado.'); // Código 400 porque el cliente envió un team inválido
    }
    user.team = team._id;

    const role = await Role.findOne({ _id: user.role })
    user.role = role._id;
    await user.save();
    res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ error: 'Error al actualizar la contraseña.' });
        next(err); // Pasar el error al siguiente middleware de manejo de errores
    }
}

async function updatePassword(req, res, next) {
  
  const user = await User.findById(req.params.id);
  user.password = req.body.password;
  try{
    // 1. Validar que los campos obligatorios estén presentes
    if (!user) {
      return res.status(400).send('Falta el usuario.');
    }
    // 2. Hashear la contraseña ANTES de actualizar el usuario
    const passEncrypted = await bcrypt.hash(user.password, saltRounds);
    user.password = passEncrypted;
  
    const team = await Team.findOne({ _id: user.team })
    if (!team) {
      return res.status(400).send('Equipo no encontrado.'); // Código 400 porque el cliente envió un team inválido
    }    
    user.team = team._id;

    const role = await Role.findOne({ _id: user.role })
    user.role = role._id;
    await user.save();
    res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ error: 'Error al actualizar la contraseña.' });
        next(err); // Pasar el error al siguiente middleware de manejo de errores
    }
}

async function createUser(req, res, next) {
 // console.log('createUser: ', req.body);
  const user = req.body;
  logger.info('createUser: ', user);
  try {
    // 1. Validar que los campos obligatorios estén presentes
    if (!user.email || !user.role || !user.team) {
      return res.status(400).send('Faltan campos obligatorios (email, password, role, team).');
    }

    // 2. Validar el formato del email (opcional, pero recomendado)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return res.status(400).send('Formato de email inválido.');
    }

    // 3. Verificar si el usuario ya existe por email (código de estado 409 Conflict es más apropiado)
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      console.log('El usuario ya existe.');
      return res.status(409).send('El usuario con este email ya existe.');
    }

    // 4. Buscar el rol
    const role = await Role.findOne({ name: user.role });
    if (!role) {
      return res.status(400).send('Role no encontrado.'); // Código 400 porque el cliente envió un rol inválido
    }

    // 5. Buscar el equipo
    const team = await Team.findOne({ idTeam: user.team });
    if (!team) {
      return res.status(400).send('Equipo no encontrado.'); // Código 400 porque el cliente envió un team inválido
    }

    // 6. Hashear la contraseña ANTES de crear el usuario
    user.password = '1'; // Contraseña por defecto
    const passEncrypted = await bcrypt.hash(user.password, saltRounds);

    // 7. Crear el nuevo usuario
    const userCreated = await User.create({
      ...user,
      password: passEncrypted, // Usar la contraseña hasheada
      team: team._id,
      role: role._id,
    });

    // 8. Responder con el usuario creado (no enviar la contraseña hasheada)
    const { password: removedPassword, ...userWithoutPassword } = userCreated.toObject();
    res.status(201).send(userWithoutPassword); // Código 201 Created para indicar creación exitosa

  } catch (err) {
    console.error('Error al crear usuario:', err);
    next(err); // Pasar el error al siguiente middleware de manejo de errores
  }
}

const getUserByField = async (fieldSearch, value) => {
  try {
    const user = await User.findOne({ [fieldSearch]: value });
    return user;
  } catch (error) {
    console.error('Error al buscar el usuario', error);
    throw error; // Si ocurre un error, lo lanzamos para que lo maneje el llamador
  }
};

export { createUser, getUserByField }; // Exporta ambas funciones si las vas a usar en otros módulos

async function updateUser(req, res, next) {
  console.log('updateUser with id: ', req.params.id)

  if (!req.params.id) {
    return res.status(404).send('Parameter id not found')
  }

  //if (!req.isAdmin() && req.params.id != req.user._id) {
  // return res.status(403).send('Unauthorized')
  //}

  // The email can't be updated
  //delete req.body.email

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

    /*if (req.body.password && false) { //descativado
      const passEncrypted = await bcrypt.hash(req.body.password, 10)
      req.body.password = passEncrypted
    }*/

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

async function blockUser(req, res, next) {
  console.log('BlockUser with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
  }

  try {
    const blockUser = await User.findById(req.params.id)

    if (!blockUser) {
      res.status(404).send('User not found')
    }

   // await User.deleteOne({ _id: user._id })
   blockUser.is_deleted = true
    await blockUser.updateOne(req.body)
    console.log(blockUser)
    res.send(blockUser)

  //  res.send(`User deleted :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

async function deleteUser(req, res, next) {
  console.log('deleteUser with id: ', req.params.id);

  if (!req.params.id) {
    res.status(500).send('The param id is not defined');
  }

  try {
    const userDeleted = await User.findById(req.params.id);
   
    if (!userDeleted) {
      res.status(404).send('User not found');
      return res.status(400).send('User not found');
    }
    const listTask = await Task.find({assigned_user : userDeleted});

    if (listTask.length > 0) {
      console.log(listTask);
      return res.status(400).send('The user cannot be deleted. Related tasks exist.');
    }

   // await User.deleteOne({ _id: user._id })
   userDeleted.is_deleted = true
    await userDeleted.deleteOne(req.body)
    console.log(userDeleted)

  res.send(`User deleted :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

export default router
