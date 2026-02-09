import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info', // Nivel mínimo de logs que se guardarán
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Captura el stack trace de los errores
    format.splat(),
    //format.json() // Formato ideal para producción
    format.printf(({ timestamp, level, message, service, stack }) => {
      return `[${timestamp}] [${service}] ${level.toUpperCase()}: ${stack || message}`;
    })
  ),
  defaultMeta: { service: 'task-management-api' },
  transports: [
    // Escribir errores en un archivo específico
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Escribir todos los logs en un archivo combinado
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Si no estamos en producción, también mostramos los logs en la consola con colores
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    ),
  }));
}

export default logger;