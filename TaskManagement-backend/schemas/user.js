import mongoose from 'mongoose'
import validate from 'mongoose-validator'
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types
// Definir el esquema de Usuario
const userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6  // Validación mínima para la contraseña
  },
  team: {
    type: String,  // Puedes cambiarlo a ObjectId si prefieres referenciar un equipo de otra colección
    required: true
  },
  role: {
    type: ObjectId,
    ref: 'Role',
    required: true, // Roles posibles del usuario
    default: 'usuario'  // Valor por defecto es "usuario"
  },
  observations: {
    type: String,
    default: ''  // Observaciones adicionales
  },
  email: {
    type: String,
    required: true,
    unique: true,  // El correo debe ser único
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un correo válido']  // Expresión regular para validar el formato del correo
  },
  phone: {
    type: String,
    default: ''  // Número de teléfono, opcional
  },
  is_deleted: {
    type: Boolean,
    default: false  // Eliminación lógica, por defecto es "false"
  },
  team:{
    type: ObjectId,
    ref: 'tm-team',
    required: false, // Roles posibles del usuario
    default: ''  // Valor por defecto es "usuario"    
  }
});

// Middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {  // Solo encripta la contraseña si ha sido modificada
    try {
      const salt = await bcrypt.genSalt(10);  // Genera un "salt"
      this.password = await bcrypt.hash(this.password, salt);  // Encripta la contraseña
      next();
    } catch (err) {
      next(err);  // Si hay error, pasa al siguiente middleware
    }
  } else {
    next();
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);  // Compara la contraseña ingresada con la encriptada
  } catch (err) {
    throw err;
  }
};

// Crear el modelo de Mongoose
const User = mongoose.model('tm-user', userSchema);

// Exportar el modelo para usarlo en otras partes de la aplicación
export default User;


