import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logger.js";
dotenv.config();

async function testdb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Conexión a la base de datos de prueba establecida");
  } catch (error) {
    logger.error("Error al conectar a la base de datos de prueba:", error);
    throw error;
  }
}

  testdb();