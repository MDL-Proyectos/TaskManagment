import dotenv from 'dotenv'
/* eslint-disable no-undef */
const env_path = process.env.NODE_ENV ? process.env.NODE_ENV : '.env'

//dotenv.config({ path: env_path })
dotenv.config();

const db_url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/'
const db_name = process.env.MONGO_DB || 'db_task'

const config = {
  mongodb: {
    url: db_url + db_name,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  moduleSystem: 'esm',
}

export const mongodb = config.mongodb;
export const migrationsDir = config.migrationsDir;
export const changelogCollectionName = config.changelogCollectionName;
export const migrationFileExtension = config.migrationFileExtension;
export const moduleSystem = config.moduleSystem;

export default config
