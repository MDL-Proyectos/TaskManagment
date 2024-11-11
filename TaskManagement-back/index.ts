import config from 'config'
//import logger from './logger.js'
import TaskManagement from './lib/taskManagement'

const api = new TaskManagement(config)
//api.BaseApi = TaskManagement

export default api