import express from 'express'
import cors, { CorsOptions } from 'cors'
import authRouter from './auth'
import { getConnection } from './infra/database'
import { jwtCheck } from './middlewares/jwt-check'
import postRouter from 'posts'
import voteRouter from '../votes'

const PORT = parseInt(process.env.PORT!, 10)
const corsOption: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true)
    }

    const host = origin.split('://')[1]
    const allowedHost = ['localhost:3000']
    const allowed = allowedHost.includes(host)
    callback(null, allowed)
  },
  credentials: true,
}

export default class Server {
  public app: express.Application

  constructor() {
    getConnection()
    this.app = express()
    this.setup()
  }

  private setup(): void {
    this.app.use(cors(corsOption))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.get('/health', (req, res) => {
      return res.send('server healthy')
    })
    this.app.use('/v1/auth', authRouter)
    this.app.use('/v1/posts', postRouter)
    this.app.use('/v1/votes/', jwtCheck, voteRouter)
    // apply jwtCheck middleware when we need to verify accessToken
    // we DO NOT need jwtCheck on "auth".
    // ex) app.post('/v1/post', jwtCheck)
    // ex) app.post('/v1/vote', jwtCheck)
    this.app.post('/', jwtCheck)
  }

  public start(): void {
    this.app.listen(PORT || 3000, () => {
      console.log(`Server Listening on port ${PORT}`)
    })
    return
  }
}
