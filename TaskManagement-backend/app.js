import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

import statusRouter from './routes/status.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import taskRouter from './routes/task.js'
import teamsRouter from './routes/team.js'
import roleRouter from './routes/roles.js'
import taskStatusRouter from './routes/TaskStatus.js'
import authentication from './middlewares/authentication.js'
import authorization from './middlewares/authorization.js'

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(authorization)

app.use('/', statusRouter)
app.use('/auth', authRouter)
//app.use('/users', authentication, userRouter)

//app.use('/auth')
app.use('/task',authentication, taskRouter)
app.use('/users',authentication, userRouter)
app.use('/teams', authentication, teamsRouter)
app.use('/roles', authentication, roleRouter)
app.use('/taskStatus',authentication, taskStatusRouter)


export default app
