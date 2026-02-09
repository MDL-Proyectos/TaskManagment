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
router.get('/taskUser/:id', getUserTasks)

const saltRounds = 10; // Define el número de rondas de hashing
//prueba de hasheo
async function passTest(req, res, next){
  const passEncrypted = await bcrypt.hash(req.params.name, saltRounds);
  
  //logger.info('name pss: ', req.params.name)
 // logger.info('> pss: ', passEncrypted)
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
  // logger.info('User password hash: ', req.body.currentPassword);
    
    const result = await user.checkPassword(req.body.currentPassword)
    if (!result.isOk) {
      logger.error('User password is invalid. Sending 401 to client')
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
  user.password = process.env.DEFAULT_PASSWORD;
  
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
        logger.error('Error al actualizar la contraseña:', error);
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
        logger.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ error: 'Error al actualizar la contraseña.' });
        next(err); 
    }
}

async function createUser(req, res, next) {
 // console.log('createUser: ', req.body);
  const user = req.body;

  try {
    // Validar que los campos obligatorios estén presentes
    if (!user.email || !user.role || !user.team) {
      return res.status(400).send('Faltan campos obligatorios (email, password, role, team).');
    }

    // Validar el formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return res.status(400).send('Formato de email inválido.');
    }

    // Verificar si el usuario ya existe por email (código de estado 409 Conflict)
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      logger.error('El mail ya existe.');
      return res.status(409).send('El usuario con este email ya existe.');
    }

    // Buscar el rol
    const role = await Role.findOne({ name: user.role });
    if (!role) {
      return res.status(400).send('Role no encontrado.'); // Código 400 porque el cliente envió un rol inválido
    }

    // Buscar el equipo
    const team = await Team.findOne({ idTeam: user.team });
    if (!team) {
      return res.status(400).send('Equipo no encontrado.'); // Código 400 porque el cliente envió un team inválido
    }

    // Hashear la contraseña ANTES de crear el usuario
    user.password = '1'; // Contraseña por defecto
    const passEncrypted = await bcrypt.hash(user.password, saltRounds);

    // Crear el nuevo usuario
    const userCreated = await User.create({
      ...user,
      password: passEncrypted, // Usar la contraseña hasheada
      team: team._id,
      role: role._id,
    });

    //  Responder con el usuario creado (no enviar la contraseña hasheada)
    const { password: removedPassword, ...userWithoutPassword } = userCreated.toObject();
    res.status(201).send(userWithoutPassword); // Código 201 Created para indicar creación exitosa

  } catch (err) {
    logger.error('Error al crear usuario:', err);
    next(err); // Pasar el error al siguiente middleware de manejo de errores
  }
}

const getUserByField = async (fieldSearch, value) => {
  try {
    const user = await User.findOne({ [fieldSearch]: value });
    return user;
  } catch (error) {
    logger.error('Error al buscar el usuario', error);
    throw error; // Si ocurre un error, lo lanzamos para que lo maneje el llamador
  }
};

export { createUser, getUserByField }; // Exporta ambas funciones si las vas a usar en otros módulos

async function updateUser(req, res, next) {

  if (!req.params.id) {
    return res.status(404).send('Parameter id not found')
  }


  try {
    const userToUpdate = await User.findById(req.params.id)
    const userNewData = req.body
    if (!userToUpdate) {
      logger.error('User not found')
      return res.status(404).send('User not found')
    }

    if (userNewData.role) {
      const newRole = await Role.findOne({ name: userNewData.role })

      if (!newRole) {
        logger.error('New role not found.')
        return res.status(400).end()
      }
      req.body.role = newRole._id
    }
    // Verifico si el usuario ya existe por email
    const existingUser = await User.findOne({ email: userToUpdate.email });
    const sameUser = existingUser._id.equals(userToUpdate._id) ;
    if (existingUser && !sameUser) {
      logger.error('El mail ya existe.');
      return res.status(409).send('El usuario con este email ya existe.');
    }    

    if (req.body.team) {
      const newTeam = await Team.findOne({ idTeam: userNewData.team })

      if (!newTeam) {
        logger.error('New team not found.')
        return res.status(400).end()
      }
      req.body.team = newTeam._id
    }

    await userToUpdate.updateOne(req.body)
    res.send(userToUpdate)

     //await userToUpdate.save()
     //res.send(userToUpdate)
  } catch (err) {
    next(err)
  }
}

async function blockUser(req, res, next) {

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
    res.send(blockUser)

  //  res.send(`User deleted :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

async function getUserTasks(req, res, next) {
  try {
    const tasks = await Task.find({ assigned_user: req.params.id });
    // Si no hay tareas, mandamos false
    if (!tasks || tasks.length === 0) {
      logger.info('User does not have tasks assigned.');
      return res.status(200).json({ hasTasks: false });
    }
    
    // Hay tareas, mandamos true
    res.status(200).json({ hasTasks: true });
    logger.info('User has tasks assigned.');

  } catch (error) {
    logger.error('Error fetching getUserTasks:', error);
    res.status(500).json({ error: 'Internal Server Error', hasTasks: false });
  }
}

async function deleteUser(req, res, next) {

  if (!req.params.id) {
    res.status(500).send('The param id is not defined');
  }

  if (req.user.role.is_admin && !req.user.is_leader) {
    logger.error('User is not admin.')
    return res.status(403).end()
  }  

  try {    
    const userDeleted = await User.findById(req.params.id);
    
    if (!userDeleted) {
      res.status(404).send('User not found');
      return res.status(400).send('User not found');
    }
    const listTask = await Task.find({assigned_user : userDeleted});

    const listTaskAuth = await Task.find({authorized_by : userDeleted});

    if (listTask.length > 0 || listTaskAuth.length > 0) {
      logger.error(listTask);
      logger.error(listTaskAuth);
      return res.status(400).send('El usuario tiene tareas asignadas o autorizadas y no puede ser eliminado.');
    }

   // await User.deleteOne({ _id: user._id })
   userDeleted.is_deleted = true
    await userDeleted.deleteOne(req.body)
    logger.info(userDeleted)

  res.send(`User deleted :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

export default router
