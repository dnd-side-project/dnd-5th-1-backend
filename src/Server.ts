import express from 'express'
import dotenv from 'dotenv'
import cors, { CorsOptions } from 'cors'

dotenv.config()

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
    this.app = express()
    this.setup()
  }

  private setup(): void {
    this.app.use(cors(corsOption))
    this.app.get('/', (req, res) => {
      return res.send('Hello')
    })
    // this.app.use('/api/auth', authRouter)
  }

  public start() {
    return this.app.listen(PORT)
  }
}
